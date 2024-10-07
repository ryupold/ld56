import { MatterJs } from "./matter.js";
import { State } from "../state.js";
import { createCreatureBody } from "./creature.js";

declare var Matter: MatterJs;

export function mouseClick(s: State, e: MouseEvent) {
    const rect = (e.target as any).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("click", x, y);

    Matter.Composite.add(s.world, createCreatureBody(x, y));
}
