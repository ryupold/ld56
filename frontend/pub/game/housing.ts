import { State } from "../state.js";
import { MatterJs } from "./matter.js";

declare var Matter: MatterJs;
const Engine = Matter.Engine,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;

export function createHousing(s: State) {
    const groundHeight = 50;
    const groundWidth = s.screen.width - 100;
    let ground = Bodies.rectangle((s.screen.width - groundWidth) / 2 + groundWidth / 2, s.screen.height - groundHeight/2, groundWidth, groundHeight, {});
    Matter.Body.setStatic(ground, true);
    Composite.add(s.world, ground);
}
