import { delay } from "../exports.js";
import { State } from "../state.js";
import { CHAIN_SEGMENT_DENSITY, CHAIN_SEGMENT_SIZE } from "./constants.js";
import { newModelID } from "./creature.js";
import { MatterJs, BodyOptions, Body } from "./matter.js";
import { ModelType } from "./model.js";

declare var Matter: MatterJs;
const Engine = Matter.Engine,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;

export function chainPositionBorder(s: State) {
    return {
        min: 30,
        max: s.screen.width - 30,
    };
}

export async function moveChain(s: State, distance: number, time: number = 3000, steps: number = 20) {
    if (s.chain.movingHorizontally) return;

    const border = chainPositionBorder(s);

    try {
        s.chain.movingHorizontally = true;
        for (let i = 0; i < steps; i++) {
            Matter.Body.translate(s.chain.anchor, { x: distance / steps, y: 0 });
            if (s.chain.anchor.position.x <= border.min) {
                s.chain.anchor.position.x = border.min;
                return;
            }
            if (s.chain.anchor.position.x >= border.max) {
                s.chain.anchor.position.x = border.max;
                return;
            }
            await delay(time / steps);
        }
    } finally {
        s.chain.movingHorizontally = false;
    }

    console.log("chain position reached ", s.chain.anchor.position.x);
}

export async function moveChainHorizontally(s: State, targetX: number, time?: number, steps: number = 20) {
    if (s.chain.movingHorizontally) return;
    try {
        s.chain.movingHorizontally = true;
        const startX = s.chain.anchor.position.x;
        if (!time) time = (targetX - startX) * 10;
        for (let i = 0; i < steps; i++) {
            Matter.Body.setPosition(s.chain.anchor, { x: startX + i / steps * (targetX - startX), y: s.chain.anchor.position.y });
            await delay(time / steps);
        }
    } finally {
        s.chain.movingHorizontally = false;
    }
}

export async function moveChainVertically(s: State, targetY: number, time: number = 3000, steps: number = 20) {
    if (s.chain.movingVertically) return;

    try {
        s.chain.movingVertically = true;
        const start = s.chain.anchor.position.y;
        for (let i = 0; i < steps; i++) {
            Matter.Body.setPosition(
                s.chain.anchor,
                {
                    x: s.chain.anchor.position.x,
                    y: start + (i / steps) * (targetY - start)
                }
            );
            if (i + 1 < steps) await delay(time / steps);
        }
    } finally {
        s.chain.movingVertically = false;
    }
}

/**
 * create a chain hanging from the top fixed by an anchor
 * @param s State
 * @returns (chain composite, anchor body)
 */
export function createChain(s: State) {
    //calculate vertical min and max chain position
    s.chain.verticalMin = -s.screen.height * 1.25;
    s.chain.verticalMax = -s.screen.height / 2.5;

    const segmentSize = CHAIN_SEGMENT_SIZE;
    const length = s.screen.height;
    const segments = Math.floor(length / segmentSize);

    let bodies = <Body[]>[];
    const opt = <BodyOptions>{
        density: CHAIN_SEGMENT_DENSITY,
        collisionFilter: { category: 0, mask: 0 },
    };
    for (let i = 0; i < segments; i++) {
        const b = Bodies.circle(0, 0, segmentSize / 2, opt);
        Matter.Body.translate(b, { x: 0, y: i * (segmentSize + 1) });
        bodies.push(b);
        s.models.push({
            id: newModelID(),
            type: ModelType.ChainSegment,
            body: b,
            img: s.images.claw.chainSegment,
            w: segmentSize, h: segmentSize,
        });
    }

    //append body for the grab count
    const grabBox = Bodies.circle(0, 0, segmentSize / 2, opt);
    Matter.Body.translate(grabBox, { x: 0, y: bodies.length * (segmentSize + 1) });
    bodies.push(grabBox);
    s.models.push({
        id: newModelID(),
        type: ModelType.ChainSegment,
        body: grabBox,
        img: s.images.claw.chainSegment,
        w: segmentSize, h: segmentSize,
    });
    s.chain.grabCounter = grabBox;

    const chain = Composites.chain(Composite.create({ bodies }), 0, 0, 0, 0, {
        length: segmentSize + 1,
        stiffness: 1,
    });
    chain.label = "chain";
    Composite.translate(chain, { x: s.screen.width / 2, y: 0 });

    const anchor = Bodies.circle(s.screen.width / 2, 0, 10, {
        label: "anchor",
        collisionFilter: { mask: 0, category: 0 }
    }
    );
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

    Composite.translate(complete, { x: 0, y: -length }, true);

    Composite.add(s.world, complete);
    return { chain, anchor };
}