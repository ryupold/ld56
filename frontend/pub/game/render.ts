import { State } from "../state.js";
import { update } from "./game.js";
import { drawHUD } from "./hud.js";
import { MatterJs } from "./matter.js";
import { ModelType } from "./model.js";
import { Sketch } from "./p5.js";

declare var Matter: MatterJs;

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


            //non-creatures
            for (const model of s.models.filter(x => x.type !== ModelType.Creature)) {
                r.push();
                r.translate(model.body.position.x, model.body.position.y);
                r.rotate(model.body.angle);
                r.imageMode(r.CENTER);
                r.image(model.img, 0, 0, model.w, model.h);
                r.pop();
            }

            // counter on claw
            drawClawGrabs(s, r);

            //creatures
            for (const model of s.models.filter(x => x.type === ModelType.Creature)) {
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

function drawClawGrabs(s: State, r: Sketch) {
    r.push(); {
        let center = {
            x: s.chain.claw.comp.composites[0].composites[0].bodies[0].position.x,
            y: s.chain.claw.comp.composites[0].composites[0].bodies[0].position.y,
        };

        const wh = 25;
        r.translate(center.x, center.y);
        r.stroke(255, 255, 255);
        r.fill(20, 20, 20);
        r.rotate(s.chain.grabCounter.angle);
        r.circle(0, 0, wh);
        r.textSize(15);
        const txt = `${s.chain.claw.grabs}`;
        // const tw = r.textWidth(txt);
        r.textAlign(r.CENTER, r.CENTER);
        r.translate(0, 0);
        r.fill(24, 200, 24);
        r.text(txt, 0, 0);
    } r.pop();

}