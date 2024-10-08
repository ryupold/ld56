import { State } from "../state.js";
import { initP5, Sketch } from "./p5.js";
import { MatterJs } from "./matter.js";
import { initGame } from "./game.js";
import { draw } from "./render.js";
import { PREFIX } from "../api/prefix.js";
import { initHUD } from "./hud.js";

declare var Matter: MatterJs;
const tickRate = 60;

function preload(s: State) {
    return function (r: Sketch) {
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster001.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster002.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster003.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster004.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster005.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster006.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster007.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster008.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster009.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster010.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster011.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster012.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster013.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster014.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster015.png`));
        s.images.creatures.push(r.loadImage(`${PREFIX}/pub/assets/img/creatures/monster016.png`));
    }
}

function setup(s: State, c: HTMLCanvasElement) {
    return function (r: Sketch) {
        r.frameRate(tickRate);
        r.createCanvas(s.screen.width, s.screen.height, c);
    }
}

export function initEngine(s: State, canvas: HTMLCanvasElement) {
    initP5(preload(s), setup(s, canvas), draw(s));

    initHUD(s);

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
    // Matter.Render.lookAt(render, {
    //     min: { x: 0, y: 0 },
    //     max: { x: s.screen.width, y: s.screen.height }
    // });
    Matter.Render.run(render);

    const runner = Matter.Runner.create({
        //defaults:
        delta: 1000 / tickRate,
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

    // s.mouse =  Matter.Mouse.create(render.canvas);

    s.patch(initGame);
}