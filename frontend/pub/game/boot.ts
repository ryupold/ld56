import { State } from "../state.js";
import { initP5, Sketch } from "./p5.js";
import { MatterJs } from "./matter.js";
import { initGame } from "./game.js";

declare var Matter: MatterJs;

function setup(r: Sketch) {
    r.createCanvas(600, 480);
}

function draw(r: Sketch) {
    r.background(0);

    r.fill(250, 100, 100);
    r.rect(20, 20, 60);
}

export function initEngine(s: State, canvas: HTMLCanvasElement) {
    // initP5(setup, draw);

    const engine = Matter.Engine.create();    
    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        canvas: canvas,
        options: {
            width: s.screen.width,
            height: s.screen.height,
            showAngleIndicator: true,
            showCollisions: true,
            showVelocity: true
        }
    });
    Matter.Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: s.screen.width, y: s.screen.height }
    });
    Matter.Render.run(render);

    const runner = Matter.Runner.create({
        //defaults:
        // delta: 1000 / 60,
        // frameDelta: null,
        // frameDeltaSmoothing: true,
        // frameDeltaSnapping: true,
        // frameDeltaHistory: [],
        // frameDeltaHistorySize: 100,
        // frameRequestId: null,
        // timeBuffer: 0,
        // timeLastTick: null,
        // maxUpdates: null,
        // maxFrameTime: 1000 / 30,
        // lastUpdatesDeferred: 0,
        // enabled: true
    });
    Matter.Runner.run(runner, engine);

    s.world = engine.world;

    s.mouse =  Matter.Mouse.create(render.canvas);

    s.patch(initGame);
}