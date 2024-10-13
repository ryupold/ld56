import { State } from "../state.js";
import { CREATURE_DENSITY, CREATURE_SIZE_MAX, CREATURE_SIZE_MIN } from "./constants.js";
import { Body, BodyOptions, MatterJs } from "./matter.js";
import { ModelType } from "./model.js";
import { Image } from "./p5.js";

export type Creature = {};

declare var Matter: MatterJs;

let lastModelID = 0;
export function newModelID(): number {
    return ++lastModelID;
}

export function createCreatureBody(x: number, y: number) {
    const isTiny = Math.random() < 0.55;

    const bodyRadius = Matter.Common.random(CREATURE_SIZE_MIN, CREATURE_SIZE_MAX);
    const limbRadius = Matter.Common.random(2, 5);

    const group = Matter.Body.nextGroup(true);
    const material = <BodyOptions>{
        collisionFilter: { group },
        density: CREATURE_DENSITY,
    };

    // const limbs = <Body[]>[];
    // for (let i = 0; i < 0; i++) {
    //     let direction = Matter.Vector.rotate({ x: 1, y: 0 }, i * (Math.PI*2 / 5));
    //     direction = Matter.Vector.mult(direction, bodyRadius + limbRadius/2);
    //     limbs.push(
    //         Matter.Bodies.circle(x + direction.x, y + direction.y, limbRadius, material)
    //     );
    // }

    const body = Matter.Body.create({
        parts: [
            Matter.Bodies.circle(x, y, bodyRadius, {
                ...material,
                density: CREATURE_DENSITY,
            }),
            // ...limbs,
        ],
        friction: 0.95,
        restitution: 0.0,
        slop: 0.01,
    });

    body.angle = Matter.Common.random(-0.2, 0.2);

    return { body, bodyRadius, limbRadius };
}


export function spawnCreatureInRect(s: State, img: Image, spawnX: number, spawnY: number, spawnW: number, spawnH: number) {
    const x = Matter.Common.random(spawnX, spawnX + spawnW);
    const y = Matter.Common.random(spawnY, spawnY + spawnH);

    const creature = createCreatureBody(x, y);
    Matter.Composite.add(s.world, creature.body);
    s.models.push({
        id: newModelID(),
        type: ModelType.Creature,
        body: creature.body,
        w: creature.bodyRadius * 3.2, h: creature.bodyRadius * 3.2,
        img: img,
    });
}