import { State } from "../state.js";
import { radians } from "./math.js";
import { setStatic } from "./matter-helpers.js";
import { MatterJs, V2 } from "./matter.js";

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
    let ground = Bodies.rectangle((s.screen.width - groundWidth) / 2 + groundWidth / 2, s.screen.height - groundHeight, groundWidth, groundHeight, {
        angle: radians(10),
    });
    Body.setStatic(ground, true);
    Composite.add(s.world, ground);
}

function createClaw(s: State) {
    const segmentWidth = 20;
    const segmentHeight = 40 + segmentWidth;
    /** (c1)
     *  |re|
     *  |ct|
     *  (c2)
     */
    function createClawSegment() {
        const rect = Bodies.rectangle(0, 0, segmentWidth, segmentHeight);
        const c1 = Bodies.circle(segmentWidth / 2, 0, segmentWidth / 2);
        const c2 = Bodies.circle(segmentWidth / 2, segmentHeight, segmentWidth / 2);
        const comp = Composite.create({ bodies: [c1, rect, c2] });
        setStatic(comp, true);
        return {
            comp: comp,
            radius: segmentWidth / 2,
            c1: <V2>{ x: segmentWidth / 2, y: 0 },
            c2: <V2>{ x: segmentWidth / 2, y: segmentHeight },
            center: <V2>{ x: segmentWidth / 2, y: 0 },
        };
    }
    const seg = createClawSegment();
    Composite.rotate(seg.comp, radians(-45), seg.c1);
    
}