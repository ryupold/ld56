import { delay } from "../exports.js";
import { State } from "../state.js";
import { CHAIN_SEGMENT_DENSITY } from "./constants.js";
import { MatterJs, BodyOptions, Body } from "./matter.js";

declare var Matter: MatterJs;
const Engine = Matter.Engine,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;


export async function moveChain(s: State, distance: number, time: number = 3000, steps: number = 20) {
    // const start = s.chain.anchor.position.x;
    for (let i = 0; i < steps; i++) {
        Matter.Body.translate(s.chain.anchor, { x: distance / steps, y: 0 });
        if (s.chain.anchor.position.x <= 0) {
            s.chain.anchor.position.x = 0;
            return;
        }
        if (s.chain.anchor.position.x >= s.screen.width) {
            s.chain.anchor.position.x = s.screen.width;
            return;
        }
        await delay(time / steps);
    }
}

export async function moveChainVertically(s: State, targetY: number, time: number = 3000, steps: number = 20) {
    const start = s.chain.anchor.position.y;
    for (let i = 0; i < steps; i++) {
        s.chain.anchor.position.y = start + (i / steps) * (targetY - start);
        if (i + 1 < steps) await delay(time / steps);
    }

    console.log(s.chain.anchor.position);
}

/**
 * create a chain hanging from the top fixed by an anchor
 * @param s State
 * @returns (chain composite, anchor body)
 */
export function createChain(s: State, length: number = 300, segmentSize: number = 10) {
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
    }
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