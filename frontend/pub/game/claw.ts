import { delay } from "../exports.js";
import { State } from "../state.js";
import { MatterJs } from "./matter.js";

declare var Matter: MatterJs;

/** for opening and closing the claw */
async function clawGrab(s: State, startU: number, startL: number, targetU: number, targetL: number, time: number = 3000, steps: number = 30) {
    for (let i = 0; i < steps; i++) {
        s.chain.claw.distance.upperConstraint.length = (1 - i / steps) * startU + i / steps * targetU;
        s.chain.claw.distance.lowerConstraint.length = (1 - i / steps) * startL + i / steps * targetL;
        await delay(time / steps);
    }
}

export async function openClaw(s: State) {
    await clawGrab(s, 60, 20, s.chain.claw.distance.upper, s.chain.claw.distance.lower);
}

export async function closeClaw(s: State) {
    await clawGrab(s, s.chain.claw.distance.upper, s.chain.claw.distance.lower, 60, 10);
}

export async function moveClaw(s: State, distance: number, time: number = 3000, steps: number = 20) {
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

export async function moveClawVertically(s: State, targetY: number, time: number = 3000, steps: number = 20) {
    const start = s.chain.anchor.position.y;
    for (let i = 0; i < steps; i++) {
        s.chain.anchor.position.y = start + (i / steps) * (targetY - start);
        if (i + 1 < steps) await delay(time / steps);
    }

    console.log(s.chain.anchor.position);
}
