import { delay } from "../exports.js";
import { State } from "../state.js";
import { createChain, moveChainHorizontally, moveChainVertically } from "./chain.js";
import { createClaw } from "./claw.js";
import { CLAW_SEPERATOR_LOWER_MAX, CLAW_SEPERATOR_UPPER_MAX } from "./constants.js";
import { spawnCreatureInRect } from "./creature.js";
import { createHousing, housingFloorWidth } from "./housing.js";
import { updateHUD } from "./hud.js";
import { MatterJs } from "./matter.js";
import { ModelType } from "./model.js";
import { Sketch } from "./p5.js";

declare var Matter: MatterJs;
const Engine = Matter.Engine,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;

export async function initGame(s: State) {
    const housing = createHousing(s);
    const chain = createChain(s);
    const claw = createClaw(s, { x: 0, y: chain.chain.bodies[chain.chain.bodies.length - 1].position.y + 10 }, { upper: CLAW_SEPERATOR_UPPER_MAX, lower: CLAW_SEPERATOR_LOWER_MAX });

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

    const resetTime = 3000;
    s.patch(moveChainVertically(s, s.chain.verticalMin, resetTime));
    s.patch(moveChainHorizontally(s, initialChainPosition(s)));
    await delay(resetTime);
    //----------------------------


    //--- spawn creatures --------
    for (let i = 0; i < 40; i++) {
        await delay(50);
        spawnCreatureInRect(s, 50, s.screen.height - s.screen.height / 3 - 100, housingFloorWidth(s) - 50, s.screen.height / 3 - 100);
    }
    //----------------------------


    s.hud.clawButton.visible = true;
}

export function initialChainPosition(s: State) {
    return s.screen.width - (s.screen.width - housingFloorWidth(s)) / 2;
}

export function update(s: State, r: Sketch) {
    checkForGrabbedCreatures(s);

    updateHUD(s, r);
}

function checkForGrabbedCreatures(s: State) {
    const removeCreatures = s.models.filter(m => m.type === ModelType.Creature && m.body.position.y > s.screen.height * 5);
    for (const model of removeCreatures) {
        Matter.Composite.remove(s.world, model.body);
        s.models.splice(s.models.indexOf(model), 1);
        console.log(`grabbed creature #${model.id}`);
        s.game.score += 1;
        s.hud.score.visible = s.game.score > 0;
    }
}


export async function* goClaw(s: State) {

}