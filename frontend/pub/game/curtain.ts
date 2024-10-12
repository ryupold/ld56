import { delay } from "../exports.js";
import { State } from "../state.js";

export async function dropCurtain(s: State) {
    if (s.hud.curtain.state === 'pulling' || s.hud.curtain.state === 'dropping') return;
    try {
        s.hud.curtain.state = 'dropping';
        await moveCurtain(s,  0);
    } finally {
        s.hud.curtain.state = 'down';
    }
}

export async function pullUpCurtain(s: State) {
    if (s.hud.curtain.state === 'pulling' || s.hud.curtain.state === 'dropping') return;

    try {
        s.hud.curtain.state = 'pulling';
        await moveCurtain(s, -(s.screen.height + 100));
    } finally {
        s.hud.curtain.state = 'up';
    }
}

async function moveCurtain(s: State, targetY: number, time: number = 2000, steps: number = 100) {
    const startY = s.hud.curtain.y;
    if (!time) time = (targetY - startY) * 10;
    for (let i = 0; i < steps; i++) {
        s.hud.curtain.y = startY + i / steps * (targetY - startY);
        await delay(time / steps);
    }
}