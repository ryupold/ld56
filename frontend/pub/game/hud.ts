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


export function updateHUD(s: State, r: Sketch) {
    if (r.mouseIsPressed && r.mouseX > s.hud.clawButton.x && r.mouseX < s.hud.clawButton.x + s.hud.clawButton.w && r.mouseY > s.hud.clawButton.y && r.mouseY < s.hud.clawButton.y + s.hud.clawButton.h && s.hud.clawButton.visible) {
        s.hud.clawButton.pressed = true;
        if (s.game.state === 'idle') {
            s.game.state = 'movingForward';
        }
        if (s.game.state === 'movingForward') {
            const border = chainPositionBorder(s);
            if (s.chain.anchor.position.x - border.min < border.min) {
                s.game.state = 'movingBack';
            }
            else if (!s.chain.movingVertically) s.patch(moveChain(s, -CHAIN_MOVEMENT_DELTA, 1000));
        }
        if (s.game.state === 'movingBack') {
            // const border = chainPositionBorder(s);
            if (!s.chain.movingVertically) s.patch(moveChain(s, CHAIN_MOVEMENT_DELTA, 1000));
        }
    } else {
        s.hud.clawButton.pressed = false;
        if (s.game.state === 'movingForward' || s.game.state === 'movingBack') {
            s.game.state = 'dropping';
            s.hud.clawButton.visible = false;
            s.patch(async () => {
                await moveChainVertically(s, s.chain.verticalMax, 3000);
                await closeClaw(s);
                s.game.state = 'pulling';
                await moveChainVertically(s, s.chain.verticalMin, 3000);
                s.game.state = 'returning';
                await moveChainHorizontally(s, initialChainPosition(s), 4000);
                await delay(500);
                await openClaw(s);
                s.game.state = 'idle';
                s.hud.clawButton.visible = true;
            });
        }
    }
}

export function drawHUD(s: State, r: Sketch) {
    const clawButton = s.hud.clawButton;
    {
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
    
    const score = s.hud.score;
    {
        if (score.visible) {
            r.push();
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
            r.pop();
        }
    }
}