import { State } from "../state.js";
import { initP5, Sketch } from "./p5.js";
import { MatterJs } from "./matter.js";
import { initGame } from "./game.js";
import { draw } from "./render.js";
import { initHUD } from "./hud.js";
import { loadClawAssets, loadCommonAssets, loadCreatureAssets, loadHousingAssets } from "./assets.js";

declare var Matter: MatterJs;
const tickRate = 60;

function preload(s: State) {
    return function (r: Sketch) {
        loadCommonAssets(s, r);
        loadCreatureAssets(s, r);
        loadClawAssets(s, r);
        loadHousingAssets(s, r);
    }
}

function setup(s: State, c: HTMLCanvasElement) {
    return function (r: Sketch) {
        r.frameRate(tickRate);
        r.createCanvas(s.screen.width, s.screen.height, c);
    }
}

export function initEngine(s: State, 
    canvas: HTMLCanvasElement, 
    debugRender: boolean = false,
) {
    initP5(preload(s), setup(s, canvas), draw(s, debugRender));

    initHUD(s);

    const engine = Matter.Engine.create();
    if (debugRender) {
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
        Matter.Render.run(render);
    }

    const runner = Matter.Runner.create({
        delta: 1000 / tickRate,
        //defaults:
        // frameDeltaSmoothing: true,
        // frameDeltaSnapping: true,
        // frameDeltaHistorySize: 100,
        // timeBuffer: 0,
        // maxUpdates: null,
        // maxFrameTime: 1000 / 30,
        // enabled: true
    });
    Matter.Runner.run(runner, engine);

    s.world = engine.world;

    s.patch(initGame);
}