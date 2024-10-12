import { delay } from "../exports.js";
import { State } from "../state.js";
import { chainPositionBorder, createChain, moveChain, moveChainHorizontally, moveChainVertically } from "./chain.js";
import { closeClaw, createClaw, openClaw } from "./claw.js";
import { CHAIN_MOVEMENT_DELTA, CLAW_SEPERATOR_LOWER_MAX, CLAW_SEPERATOR_UPPER_MAX, CREATURE_COUNT_MAX, CREATURE_SIZE_MAX } from "./constants.js";
import { spawnCreatureInRect } from "./creature.js";
import { dropCurtain, pullUpCurtain } from "./curtain.js";
import { createHousing, housingFloorWidth } from "./housing.js";
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
    createHousing(s);
    linkChainAndClaw(s);

    restartGame(s);
    
    await delay(10000);
    restartGame(s);
}

export async function restartGame(s: State, resetTime: number = 3000) {
    await Promise.all([
        dropCurtain(s),
        moveChainVertically(s, s.chain.verticalMin, resetTime),
        moveChainHorizontally(s, initialChainPosition(s)),
    ]);

    //remove all creatures
    const creatures = s.models.filter(m => m.type === ModelType.Creature);
    s.models = s.models.filter(m => m.type !== ModelType.Creature);

    for (const creature of creatures) {
        Matter.Composite.remove(s.world, creature.body);
    }

    spawnCreatures(s);

    await pullUpCurtain(s);

    s.images.targetCreature = Matter.Common.choose([...s.images.creaturesA, ...s.images.creaturesB]);
    s.hud.clawButton.visible = true;
    s.game.started = true;
    
    if (s.debug.grabbing) {
        s.patch(automateClaw);
    }
}

function linkChainAndClaw(s: State) {
    const chain = createChain(s);
    const claw = createClaw(s, { x: 0, y: chain.chain.bodies[chain.chain.bodies.length - 1].position.y + 10 }, { upper: CLAW_SEPERATOR_UPPER_MAX, lower: CLAW_SEPERATOR_LOWER_MAX });

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
}

function spawnCreatures(s: State) {
    const spawnRect = {
        x: 50,
        y: 0,
        w: housingFloorWidth(s) - 150,
        h: s.screen.height / 3,
    };
    const creatureCount = Math.min(CREATURE_COUNT_MAX, spawnRect.w * spawnRect.h / (2*CREATURE_SIZE_MAX * CREATURE_SIZE_MAX));
    //--- spawn creatures --------
    for (let i = 0; i < creatureCount; i++) {
        spawnCreatureInRect(s, spawnRect.x, spawnRect.y, spawnRect.w, spawnRect.h);
    }
}


export function clawMovementAndUpdateHUD(s: State, r: Sketch) {
    if (s.debug.pressingHold || (r.mouseIsPressed && r.mouseX > s.hud.clawButton.x && r.mouseX < s.hud.clawButton.x + s.hud.clawButton.w && r.mouseY > s.hud.clawButton.y && r.mouseY < s.hud.clawButton.y + s.hud.clawButton.h && s.hud.clawButton.visible)) {
        s.hud.clawButton.pressed = true;
        if (s.game.state === 'idle') {
            s.game.state = 'movingForward';
        }
        if (s.game.state === 'movingForward') {
            const border = chainPositionBorder(s);
            if (s.chain.anchor.position.x - border.min < border.min) {
                s.game.state = 'movingBack';
            }
            else if (!s.chain.movingVertically) s.patch(moveChain(s, -CHAIN_MOVEMENT_DELTA, 800));
        }
        if (s.game.state === 'movingBack') {
            const border = chainPositionBorder(s);
            if (s.chain.anchor.position.x + border.min * 4 > border.max) {
                s.game.state = 'movingForward';
            }
            else if (!s.chain.movingVertically) s.patch(moveChain(s, CHAIN_MOVEMENT_DELTA, 800));
        }
    } else {
        s.hud.clawButton.pressed = false;
        if (s.game.state === 'movingForward' || s.game.state === 'movingBack') {
            s.chain.claw.grabs++;
            s.game.state = 'dropping';
            s.hud.clawButton.visible = false;
            s.patch(async () => {
                await moveChainVertically(s, s.chain.verticalMax, 3000);
                await closeClaw(s);
                s.game.state = 'pulling';
                await moveChainVertically(s, s.chain.verticalMin, 3000);
                s.game.state = 'returning';
                await moveChainHorizontally(s, initialChainPosition(s));
                await delay(500);
                await openClaw(s);
                s.game.state = 'idle';
                s.hud.clawButton.visible = true;
            });
        }
    }
}

export function initialChainPosition(s: State) {
    return s.screen.width - (s.screen.width - housingFloorWidth(s)) / 2;
}

export function update(s: State, r: Sketch) {
    checkForGrabbedCreatures(s);

    clawMovementAndUpdateHUD(s, r);
}

function checkForGrabbedCreatures(s: State) {
    const removeCreatures = s.models.filter(m => m.type === ModelType.Creature && m.body.position.y > s.screen.height * 5);
    for (const model of removeCreatures) {
        Matter.Composite.remove(s.world, model.body);
        s.models.splice(s.models.indexOf(model), 1);
        s.game.score += 1;
        s.hud.score.visible = s.game.score > 0;
    }
}


/**
 * "play" the game in idle mode
 * @param s {State}
 */
export async function* automateClaw(s: State) {
    while (s.game.started && s.models.filter(m => m.type === ModelType.Creature).length > 0) {
        if (s.game.state === 'idle') {
            // press the button for 100ms - 15000ms
            s.debug.pressingHold = true;
            yield await delay(Matter.Common.random(100, 15000));
            s.debug.pressingHold = false;
        }
        else yield await delay(1000);
    }
}