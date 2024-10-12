import { MatterJs } from "./matter.js";
import { State } from "../state.js";

declare var Matter: MatterJs;

/** for debugging */
export function mouseClick(s: State, e: MouseEvent) {
    const rect = (e.target as any).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("click", x, y);

    // const creature = createCreatureBody(x, y);
    // Matter.Composite.add(s.world, creature.body);
    // s.models.push({
    //     id: newModelID(),
    //     type: ModelType.Creature,
    //     body: creature.body,
    //     w: creature.bodyRadius, h: creature.bodyRadius,
    //     img: Matter.Common.choose(s.images.creaturesA),
    // });
}
