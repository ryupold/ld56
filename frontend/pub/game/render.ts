import { State } from "../state.js";
import { update } from "./game.js";
import { drawHUD } from "./hud.js";
import { Composite } from "./matter.js";
import { Sketch } from "./p5.js";

export function draw(s: State) {
    return function (r: Sketch) {
        update(s, r);
        r.background(0, 0, 0, 0);
        // return;
        //background
        r.imageMode(r.CORNER);
        r.tint(255, 128);
        r.image(s.images.common.background, 0, 0, s.screen.width, s.screen.height);
        r.noTint();

        //models
        for (const model of s.models) {
            r.push();
            r.translate(model.body.position.x, model.body.position.y);
            r.rotate(model.body.angle);
            r.imageMode(r.CENTER);
            r.image(model.img, 0, 0, model.w, model.h);
            // r.translate(0, 0);
            // console.log("draw", model.body.position);
            r.pop();
        }

        drawHUD(s, r);
    }
}