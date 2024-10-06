import { State } from "../state.js";
import { radians } from "./math.js";
import { setStatic } from "./matter-helpers.js";
import { MatterJs, V2, Composite as CompositeType, Body, BodyOptions } from "./matter.js";

declare var Matter: MatterJs;
const Engine = Matter.Engine,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;


export async function initGame(s: State) {
    createHousing(s);


    const chain = createChain(s);
    const claw = createClaw(s);
    console.log(claw.composites[0].composites[0].bodies[0]);
    Composite.add(s.world, Composite.create({
        // composites: [chain.chain, claw],
        constraints: [
            Constraint.create({
                bodyA: chain.chain.bodies[chain.chain.bodies.length - 1],
                bodyB: claw.composites[0].composites[0].bodies[0],
            }),
        ]
    }));

    //test
    // const bobby = Matter.Bodies.circle(100, 100, 50);
    // Matter.Composite.add(s.world, bobby);
}

function createHousing(s: State) {
    const groundHeight = 50;
    const groundWidth = s.screen.width - 100;
    let ground = Bodies.rectangle((s.screen.width - groundWidth) / 2 + groundWidth / 2, s.screen.height - groundHeight, groundWidth, groundHeight, {
        angle: radians(10),
    });
    Matter.Body.setStatic(ground, true);
    Composite.add(s.world, ground);
}

function createClaw(s: State) {
    const segmentWidth = 20;
    const segmentHeight = 40 + segmentWidth;
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
            density: 0.00001,
            // chamfer: { radius: seg.radius },
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
                }),
                Constraint.create({
                    bodyA: c2,
                    bodyB: rect,
                    pointB: seg.c2,
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
    Composite.translate(tll.comp, Vector.add({ x: -15, y: 1 }, Vector.add(tll.comp.bodies[2].position, tlu.comp.bodies[2].position)));
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
    Composite.translate(trl.comp, Vector.add({ x: 15, y: 1 }, Vector.add(trl.comp.bodies[2].position, tru.comp.bodies[2].position)));
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

    const claw = Composite.create({
        composites: [clawLeft, clawRight],
        constraints: [
            Constraint.create({
                bodyA: tlu.comp.bodies[0],
                bodyB: tru.comp.bodies[0],
                stiffness: 1,
            })
        ]
    });


    // Composite.translate(claw, { x: 100, y: 100 }, true);
    Composite.translate(claw, { x: s.screen.width / 2, y: 160 }, true);

    Composite.add(s.world, claw);
    return claw;
}


/**
 * create a chain hanging from the top fixed by an anchor
 * @param s State
 * @returns (chain composite, anchor body)
 */
export function createChain(s: State) {
    const segmentSize = 20;
    const length = 100;
    const segments = Math.floor(length / segmentSize);

    let bodies = <Body[]>[];
    const opt = <BodyOptions>{ collisionFilter: { category: 0, mask: 0 } };
    for (let i = 0; i < segments; i++) {
        const b = Bodies.circle(0, 0, segmentSize/2, opt);
        Matter.Body.translate(b, { x: 0, y: i * (segmentSize+1) });
        bodies.push(b);
    }
    const chain = Composites.chain(Composite.create({ bodies }), 0, 0, 0, 0, {
        length: segmentSize + 1,
        stiffness: 1,
    });
    Composite.translate(chain, { x: s.screen.width / 2, y: 20 });

    const anchor = Bodies.circle(s.screen.width / 2, 0, 10, {collisionFilter: { mask: 0, category: 0 }});
    Matter.Body.setStatic(anchor, true);
    const complete = Composite.create({
        bodies: [anchor],
        composites: [chain],
        constraints: [Constraint.create({
            bodyA: anchor,
            pointA: { x: 0, y: 10 },
            bodyB: chain.bodies[0],
            stiffness: 1,
            damping: 1
        })],
    });


    Composite.add(s.world, complete);
    return { chain, anchor };
}