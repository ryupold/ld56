import { delay } from "../exports.js";
import { State } from "../state.js";
import { CLAW_DENSITY } from "./constants.js";
import { radians } from "./math.js";
import { MatterJs, V2, Composite as CompositeType } from "./matter.js";

declare var Matter: MatterJs;
const Engine = Matter.Engine,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;

/** for opening and closing the claw */
async function clawGrab(s: State, startU: number, startL: number, targetU: number, targetL: number, time: number = 3000, steps: number = 30) {
    startU = s.chain.claw.distance.upperConstraint.length;
    startL = s.chain.claw.distance.lowerConstraint.length;
    for (let i = 0; i < steps; i++) {
        s.chain.claw.distance.upperConstraint.length = (1 - i / steps) * startU + i / steps * targetU;
        s.chain.claw.distance.lowerConstraint.length = (1 - i / steps) * startL + i / steps * targetL;
        await delay(time / steps);
    }
}

export async function openClaw(s: State) {
    if(s.chain.claw.clawing) return;
    s.chain.claw.clawing = true;
    await clawGrab(s, s.chain.claw.distance.upperMin, s.chain.claw.distance.lowerMin, s.chain.claw.distance.upperMax, s.chain.claw.distance.lowerMax);
    s.chain.claw.clawing = false;
}

export async function closeClaw(s: State) {
    if(s.chain.claw.clawing) return;
    s.chain.claw.clawing = true;
    await clawGrab(s, s.chain.claw.distance.upperMax, s.chain.claw.distance.lowerMax, s.chain.claw.distance.upperMin, s.chain.claw.distance.lowerMin);
    s.chain.claw.clawing = false;
}

export function createClaw(s: State, offset: V2, open: { upper: number, lower: number }) {
    const segmentWidth = 10;
    const segmentHeight = 50;
    /** (c1)
     *  |re|
     *  |ct|
     *  (c2)
     */
    function createClawSegment(group: number) {

        const seg = {
            comp: <CompositeType><unknown>undefined,
            group: group,
            radius: segmentWidth / 2,
            c1: <V2>{ x: 0, y: -segmentHeight / 2 },
            c2: <V2>{ x: 0, y: segmentHeight / 2 },
        };

        const options = {
            collisionFilter: { group: seg.group },
            density: CLAW_DENSITY,
            chamfer: { radius: segmentWidth/2 }, //TODO: test this
        };

        const c1 = Bodies.circle(seg.c1.x, seg.c1.y, seg.radius, options);
        const rect = Bodies.rectangle(0, 0, segmentWidth, segmentHeight, options);
        const c2 = Bodies.circle(seg.c2.x, seg.c2.y, seg.radius, options);

        seg.comp = Composite.create({
            label: "claw segment",
            bodies: [
                c1,
                rect,
                c2,
            ],
            constraints: [
                Constraint.create({
                    bodyA: c1,
                    bodyB: rect,
                    pointB: seg.c1,
                    stiffness: 1,
                }),
                Constraint.create({
                    bodyA: c2,
                    bodyB: rect,
                    pointB: seg.c2,
                    stiffness: 1,
                }),
            ]
        });
        return seg;
    }

    //=== creating segments ===
    const leftGroup = Matter.Body.nextGroup(true);
    //top-left-upper
    const tlu = createClawSegment(leftGroup);
    Composite.rotate(tlu.comp, radians(45), tlu.c1);
    //top-left-lower
    const tll = createClawSegment(leftGroup);
    Composite.rotate(tll.comp, radians(-15), tll.c1);
    Composite.translate(tll.comp, Vector.add({ x: -10, y: 1 }, Vector.add(tll.comp.bodies[2].position, tlu.comp.bodies[2].position)));
    const clawLeft = Composite.create({
        composites: [tlu.comp, tll.comp],
        constraints: [
            Constraint.create({
                bodyA: tlu.comp.bodies[2],
                bodyB: tll.comp.bodies[0],
                stiffness: 1,
            })
        ]
    });

    const rightGroup = leftGroup;//Matter.Body.nextGroup(true);
    //top-right-upper
    const tru = createClawSegment(rightGroup);
    Composite.rotate(tru.comp, radians(-45), tru.c1);
    Composite.translate(tru.comp, { x: 0, y: 0 });
    //top-right-lower
    const trl = createClawSegment(rightGroup);
    Composite.rotate(trl.comp, radians(15), trl.c1);
    Composite.translate(trl.comp, Vector.add({ x: 10, y: 1 }, Vector.add(trl.comp.bodies[2].position, tru.comp.bodies[2].position)));
    const clawRight = Composite.create({
        composites: [tru.comp, trl.comp],
        constraints: [
            Constraint.create({
                bodyA: tru.comp.bodies[2],
                bodyB: trl.comp.bodies[0],
                stiffness: 1,
            })
        ]
    });

    const distanceKeeperUpper = Constraint.create({
        bodyA: tlu.comp.bodies[2],
        bodyB: tru.comp.bodies[2],
        stiffness: 1,
        length: open.upper,
    });
    const distanceKeeperLower = Constraint.create({
        bodyA: tll.comp.bodies[2],
        bodyB: trl.comp.bodies[2],
        stiffness: 1,
        length: open.lower,
    });
    const spacerL = Constraint.create({
        bodyA: tll.comp.bodies[2],
        bodyB: tlu.comp.bodies[0],
        stiffness: 0.7,
        length: segmentHeight*1.8,
    });
    const spacerR = Constraint.create({
        bodyA: trl.comp.bodies[2],
        bodyB: tru.comp.bodies[0],
        stiffness: 0.7,
        length: segmentHeight*1.8,
    });

    const claw = Composite.create({
        composites: [clawLeft, clawRight],
        constraints: [
            // bolt both sides together at the top
            Constraint.create({
                bodyA: tlu.comp.bodies[0],
                bodyB: tru.comp.bodies[0],
                stiffness: 1,
            }),

            //distance keeper in the middle of the claw
            distanceKeeperUpper,

            //distance at the bottom of the claw
            distanceKeeperLower,

            //spacers
            spacerL,
            spacerR,
        ]
    });


    // Composite.translate(claw, { x: 100, y: 100 }, true);
    Composite.translate(claw, Vector.add({ x: s.screen.width / 2, y: 0 }, offset), true);

    Composite.add(s.world, claw);
    return { claw, distance: { upper: distanceKeeperUpper, lower: distanceKeeperLower } };
}