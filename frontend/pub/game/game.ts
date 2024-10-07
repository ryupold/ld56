import { State } from "../state.js";
import { createChain } from "./chain.js";
import { createClaw } from "./claw.js";
import { createHousing } from "./housing.js";
import { MatterJs } from "./matter.js";

declare var Matter: MatterJs;
const Engine = Matter.Engine,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;

export async function initGame(s: State) {
    const housing =createHousing(s);
    const chain = createChain(s);
    const claw = createClaw(s, { x: 0, y: chain.chain.bodies[chain.chain.bodies.length - 1].position.y + 10 }, { upper: s.chain.claw.distance.upperMax, lower: s.chain.claw.distance.lowerMax});

    //--- combine chain & claw ---
    Composite.add(s.world, Composite.create({
        constraints: [
            Constraint.create({
                bodyA: chain.chain.bodies[chain.chain.bodies.length - 1],
                bodyB: claw.claw.composites[0].composites[0].bodies[0],
            }),
        ]
    }));
    s.chain.anchor = chain.anchor;
    s.chain.claw.comp = claw.claw;
    s.chain.claw.distance.upperConstraint = claw.distance.upper;
    s.chain.claw.distance.lowerConstraint = claw.distance.lower;
    //----------------------------
}

