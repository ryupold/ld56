import { State } from "../state.js";
import { Body, BodyOptions, MatterJs } from "./matter.js";
import { ModelType } from "./model.js";

export type Creature = {};

declare var Matter: MatterJs;

let lastModelID = 0;
export function newModelID(): number {
    return ++lastModelID;
}

export function createCreatureBody(x: number, y: number) {
    const bodyRadius = Matter.Common.random(10, 20);
    const limbRadius = Matter.Common.random(1, 3);
    const group = Matter.Body.nextGroup(true);

    const limbs = <Body[]>[];
    const material = <BodyOptions>{
        collisionFilter: { group },
        density: 0.000001,
    };

    for (let i = 0; i < 5; i++) {
        let direction = Matter.Vector.rotate({ x: 1, y: 0 }, i * (Math.PI*2 / 5));
        direction = Matter.Vector.mult(direction, bodyRadius + limbRadius/2);
        limbs.push(
            Matter.Bodies.circle(x + direction.x, y + direction.y, limbRadius, material)
        );
    }

    const body = Matter.Body.create({
        parts: [
            Matter.Bodies.circle(x, y, bodyRadius, {...material, 
                density: material.density! * 1, 
            }),
            ...limbs,
        ],
        friction: 0.9,
        restitution: 0,
        slop: 0.5,
    });

    body.angle = Matter.Common.random(-0.2, 0.2);

    return {body, bodyRadius, limbRadius};
}


export function spawnCreatureInRect(s: State, spawnX: number, spawnY: number, spawnW: number, spawnH: number){
    const x = Matter.Common.random(spawnX, spawnX + spawnW);
    const y = Matter.Common.random(spawnY, spawnY + spawnH);

    const creature = createCreatureBody(x, y);
    Matter.Composite.add(s.world, creature.body);
    s.models.push({
        id: newModelID(),
        type: ModelType.Creature,
        body: creature.body,
        w: creature.bodyRadius * 3.5, h: creature.bodyRadius * 3.5,
        img: Matter.Common.choose(s.images.creatures),
    });
}