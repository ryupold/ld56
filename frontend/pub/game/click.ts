import { MatterJs } from "./matter.js";
import { State } from "../state.js";
import { createCreatureBody } from "./creature.js";
import { Image } from "./p5.js";

declare var Matter: MatterJs;

export function mouseClick(s: State, e: MouseEvent) {
    const rect = (e.target as any).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("click", x, y);

    const creature = createCreatureBody(x, y);
    Matter.Composite.add(s.world, creature.body);
    s.drawModels.push({
        body: creature.body,
        w: creature.bodyRadius, h: creature.bodyRadius,
        img: Matter.Common.choose(s.images.creatures),
    });
}
