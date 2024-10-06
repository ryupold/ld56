import { State } from "../state.js";
import { initP5, Sketch } from "./p5.js";
import { MatterJs, World } from "./matter.js";

declare var Matter: MatterJs;

let world: World;

function setup(r: Sketch) {
    r.createCanvas(600, 480);
}

function draw(r: Sketch) {
    r.background(0);

    r.fill(250, 100, 100);
    r.rect(20, 20, 60);
}

export function startGame(s: State) {
    // initP5(setup, draw);

    const engine = Matter.Engine.create();
    world = engine.world;

    const render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            showAngleIndicator: true,
            showCollisions: true,
            showVelocity: true
        }
    });
    Matter.Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });
    Matter.Render.run(render);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.9,
            render: {
                visible: true
            }
        }
    });
    Matter.Composite.add(world, mouseConstraint);
    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // Matter.Engine.run(engine);
    const runner = Matter.Runner.create({
        delta: 1000 / 60,
        enabled: true
    });
    Matter.Runner.run(runner, engine);


    //TODO: move somewhere else
    setInterval(() => {
        const bobby = Matter.Bodies.circle(100, 100, 50);
        Matter.Composite.add(world, bobby);
    }, 1111);
}