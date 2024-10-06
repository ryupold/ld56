import { State } from "../state.js";
import { radians } from "./math.js";
import { MatterJs } from "./matter.js";

declare var Matter: MatterJs;
const Engine = Matter.Engine,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies,
    Body = Matter.Body;


export async function initGame(s: State) {
    createHousing(s);

    //test
    const bobby = Matter.Bodies.circle(100, 100, 50);
    Matter.Composite.add(s.world, bobby);
}

function createHousing(s: State) {
    const groundHeight = 50;
    const groundWidth = s.screen.width - 100;
    let ground = Bodies.rectangle((s.screen.width - groundWidth)/2 + groundWidth/2, s.screen.height - groundHeight, groundWidth, groundHeight, {
        angle: radians(10),
    });
    Body.setStatic(ground, true);
    Composite.add(s.world, ground);
}