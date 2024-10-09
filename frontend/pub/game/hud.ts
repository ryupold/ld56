import { delay } from "../exports.js";
import { State } from "../state.js";
import { chainPositionBorder, moveChain, moveChainHorizontally, moveChainVertically } from "./chain.js";
import { closeClaw, openClaw } from "./claw.js";
import { CHAIN_MOVEMENT_DELTA } from "./constants.js";
import { initialChainPosition } from "./game.js";
import { housingFloorWidth } from "./housing.js";
import { Sketch } from "./p5.js";

export function initHUD(s: State) {
    s.hud.clawButton.x = s.screen.width - (s.screen.width - housingFloorWidth(s)) / 1.5;
    s.hud.clawButton.y = s.screen.height - 100;

    s.hud.score.x = s.hud.clawButton.x;
    s.hud.score.y = s.hud.clawButton.y - 75;
}

export function drawHUD(s: State, r: Sketch) {
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

    r.push();
    {
        r.translate(0, 0);
        r.fill(255, 255, 255);
        r.textSize(18);
        r.textAlign(r.LEFT, r.CENTER);
        r.text(`FPS: ${(r.frameCount * 1000 / (Date.now() - s.start)).toFixed(0)}   Grabs: ${s.chain.claw.grabs}`, 20, 10);
    }
    r.pop();
}