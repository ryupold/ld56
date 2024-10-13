import { State } from "../state.js";
import { gameOver, restartGame } from "./game.js";
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

    restartButton(s, r);

    drawScore(s, r);

    // drawFPS(s, r);

    drawTarget(s, r);

    drawCurtain(s, r);
}

function drawClawButton(s: State, r: Sketch) {
    const clawButton = s.hud.clawButton;
    if (clawButton.visible) {
        r.push();

        let x = clawButton.x;
        let y = clawButton.y;
        let w = clawButton.w;
        let h = clawButton.h;

        if (clawButton.pressed) {
            x = clawButton.x - (clawButton.wm - clawButton.w) / 2;
            y = clawButton.y - (clawButton.hm - clawButton.h) / 2;
            w = clawButton.wm;
            h = clawButton.hm;
        }

        r.translate(x, y);
        r.stroke(255, 255, 255);

        if (clawButton.pressed)
            r.fill(200, 200, 200);
        else
            r.fill(24, 24, 24);

        r.circle(w / 2, h / 2, w);
        r.textSize(18);
        r.textAlign(r.CENTER, r.CENTER);
        const tw = r.textWidth("🟢");
        r.translate(tw / 2, h / 2);

        if (clawButton.pressed)
            r.fill(255, 255, 255);
        else
            r.fill(24, 24, 24);

        r.text("🟢", (w - tw) / 2, 0);
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
    if (s.hud.curtain.state === 'up') return;

    r.push(); {
        r.translate(0, s.hud.curtain.y);
        r.imageMode(r.CORNER);
        for (let i = 0; i < s.hud.curtain.segments; i++) {
            // r.tint(255, 128);
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
        r.textSize(10);
        r.fill(128);
        r.textAlign(r.LEFT, r.TOP);
        r.text(`${fps.toFixed(0)} FPS`, s.screen.width - 60, 10);
    }
    r.pop();
}


export function resetHelp(s: State) {
    showHelpStarted = Date.now();
}

let showHelpStarted = Date.now();
function drawTarget(s: State, r: Sketch) {
    if (!s.images.targetCreature) return;

    r.push(); {
        r.translate(25, 10);
        const size = { w: 60, h: 60 };
        r.stroke(255, 255, 255);
        r.fill(40);
        r.circle(size.w / 2, size.h / 2, size.w + 6);
        r.imageMode(r.CORNER);
        r.image(s.images.targetCreature, 0, 0, size.w, size.h);

        if (Date.now() - showHelpStarted <= s.hud.showHelpTime) {
            r.translate(size.w + 5, size.h / 2);
            r.textSize(18);
            r.textAlign(r.LEFT, r.CENTER);
            r.stroke(0)
            r.fill(255)
            r.textAlign(r.LEFT, r.CENTER);
            let sin = Math.sin(Date.now() / 300);
            if (sin < 0) sin /= 4;
            r.text("👈 find and grab this creature", Math.abs(sin * 30), 0);
        }
    } r.pop();
}


let restartPressed = false;

function restartButton(s: State, r: Sketch) {
    if (s.game.started) {
        r.push();
        const topLeft = { x: s.screen.width - s.hud.restartButton.w * 1.3 - s.hud.restartButton.x, y: 0 };
        r.translate(s.screen.width - s.hud.restartButton.w * 1.3 - s.hud.restartButton.x, 0);
        r.stroke(255, 255, 255);

        r.fill(24, 24, 24);

        r.circle(s.hud.restartButton.w / 2, s.hud.restartButton.h / 2, s.hud.restartButton.w * 0.75);
        r.textSize(18);
        r.textAlign(r.CENTER, r.CENTER);
        const tw = r.textWidth("🔄️");
        r.translate(tw / 2, s.hud.restartButton.h / 2);

        r.fill(255, 255, 255);

        r.text("🔄️", (s.hud.restartButton.w - tw) / 2, 0);
        r.pop();

        const isHovering = r.mouseX > topLeft.x && r.mouseX < topLeft.x + s.hud.restartButton.w && r.mouseY > topLeft.y && r.mouseY < topLeft.y + s.hud.restartButton.h;
        if (r.mouseIsPressed && isHovering && !restartPressed) {
            restartPressed = true;
        } else if (!r.mouseIsPressed && isHovering && restartPressed) {
            restartPressed = false;
            s.patch(gameOver);
        }
    }
}