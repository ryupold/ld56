import { State } from "../state.js";
import { housingFloorWidth } from "./housing.js";
import { Sketch } from "./p5.js";


export function initHUD(s: State) {
    s.hud.clawButton.x = s.screen.width - (s.screen.width - housingFloorWidth(s)) / 1.5;
    s.hud.clawButton.y = s.screen.height - 100;

    s.hud.score.x = s.hud.clawButton.x;
    s.hud.score.y = s.hud.clawButton.y - 75;
}

export function drawHUD(s: State, r: Sketch) {
    drawClawButton(s, r);

    drawScore(s, r);

    drawFPS(s, r);

    drawCurtain(s, r);
}

function drawClawButton(s: State, r: Sketch) {
    const clawButton = s.hud.clawButton;
    if (clawButton.visible) {
        r.push();
        r.translate(clawButton.x, clawButton.y);
        r.stroke(255, 255, 255);

        if (clawButton.pressed)
            r.fill(200, 200, 200);
        else
            r.fill(24, 24, 24);

        r.rect(0, 0, clawButton.w, clawButton.h);
        r.textSize(18);
        r.textAlign(r.CENTER, r.CENTER);
        const tw = r.textWidth("GO");
        r.translate(tw / 2, clawButton.h / 2);


        if (clawButton.pressed)
            r.fill(255, 255, 255);
        else
            r.fill(24, 24, 24);

        r.text("GO", (clawButton.w - tw) / 2, 0);
        r.pop();
    }
}

function drawScore(s: State, r: Sketch) {
    const score = s.hud.score;
    if (score.visible) {
        r.push();
        {
            r.translate(score.x, score.y);
            r.stroke(255, 255, 255);
            r.fill(10, 10, 10);
            r.rect(0, 0, score.w, score.h);
            r.textSize(18);
            r.textAlign(r.CENTER, r.CENTER);
            const scoreTxt = `${s.game.score}`;
            const tw = r.textWidth(scoreTxt);
            r.translate(tw / 2, score.h / 2);
            r.fill(255, 255, 255);
            r.text(scoreTxt, (score.w - tw) / 2, 0);
        }
        r.pop();
    }
}

function drawCurtain(s: State, r: Sketch) {
    if(s.hud.curtain.state === 'up') return;

    r.push(); {
        r.translate(0, s.hud.curtain.y);
        r.imageMode(r.CORNER);
        for (let i = 0; i < s.hud.curtain.segments; i++) {
            r.tint(255, 128);
            r.image(s.images.hud.curtain, i * s.screen.width / s.hud.curtain.segments, 0, s.screen.width / s.hud.curtain.segments, s.screen.height);
        }
    } r.pop();
}

let frames = 0;
let fps = 60;
let lastFpsMeasure = Date.now();
function drawFPS(s: State, r: Sketch) {
    frames++;
    const now = Date.now();
    if (now >= lastFpsMeasure + 1000) {
        fps = frames * 1000 / (now - lastFpsMeasure);
        lastFpsMeasure = now;
        frames = 0;
    }

    r.push();
    {
        r.translate(0, 0);
        r.fill(255, 255, 255);
        r.textSize(18);
        r.textAlign(r.LEFT, r.TOP);
        r.text(`Grabs: ${s.chain.claw.grabs}`, 20, 10);
        r.textSize(10);
        r.fill(128);
        r.textAlign(r.LEFT, r.TOP);
        r.text(`${fps.toFixed(0)} FPS`, s.screen.width - 60, 10);
    }
    r.pop();
}