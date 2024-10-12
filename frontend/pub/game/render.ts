import { State } from "../state.js";
import { update } from "./game.js";
import { drawHUD } from "./hud.js";
import { Composite, MatterJs } from "./matter.js";
import { Sketch } from "./p5.js";

declare var Matter : MatterJs;

export function draw(s: State, debugRender: boolean = false) {
    return function (r: Sketch) {
        update(s, r);
        r.background(0, 0, 0, 0);
        if (!debugRender) {
            //background
            r.imageMode(r.CORNER);
            r.tint(255, 128);
            r.image(s.images.hud.background, 0, 0, s.screen.width, s.screen.height);
            r.noTint();

            //models
            for (const model of s.models) {
                r.push();
                r.translate(model.body.position.x, model.body.position.y);
                r.rotate(model.body.angle);
                r.imageMode(r.CENTER);
                r.image(model.img, 0, 0, model.w, model.h);
                r.pop();
            }
        }

        drawHUD(s, r);
    }
}


// function drawClawGrabs(s: State, r: Sketch) {
//     r.push(); {
        
//         r.translate(clawButton.x, clawButton.y);
//         r.stroke(255, 255, 255);

//         if (clawButton.pressed)
//             r.fill(200, 200, 200);
//         else
//             r.fill(24, 24, 24);

//         r.rect(0, 0, clawButton.w, clawButton.h);
//         r.textSize(18);
//         r.textAlign(r.CENTER, r.CENTER);
//         const tw = r.textWidth("GO");
//         r.translate(tw / 2, clawButton.h / 2);


//         if (clawButton.pressed)
//             r.fill(255, 255, 255);
//         else
//             r.fill(24, 24, 24);

//         r.text("GO", (clawButton.w - tw) / 2, 0);
//     } r.pop();

// }