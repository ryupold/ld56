import { State } from "../state.js";
import { update } from "./game.js";
import { Composite } from "./matter.js";
import { Sketch } from "./p5.js";

export function draw(s: State) {
    return function (r: Sketch) {
        update(s);
        r.background(0, 0, 0, 0);

        for (const model of s.models) {
            r.push();
            r.translate(model.body.position.x, model.body.position.y);
            r.rotate(model.body.angle);
            r.imageMode(r.CENTER);
            r.image(model.img, 0, 0, model.w*4, model.h*4);
            // r.translate(0, 0);
            // console.log("draw", model.body.position);
            r.pop();
        }

    }
}