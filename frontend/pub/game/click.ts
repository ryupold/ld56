import { MatterJs } from "./matter.js";
import { State } from "../state.js";

declare var Matter: MatterJs;

export function mouseClick(s: State, e: MouseEvent) {
    const rect = (e.target as any).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("click", x, y);

    Matter.Composite.add(s.world, Matter.Bodies.rectangle(x, y, 20, 30, {density: 0.00001}));
}