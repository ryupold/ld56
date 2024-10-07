import { Body, BodyOptions, MatterJs } from "./matter.js";

export type Creature = {};

declare var Matter: MatterJs;

export function createCreatureBody(x: number, y: number) {
    const bodyRadius = Matter.Common.random(10, 20);
    const limbRadius = Matter.Common.random(3, 5);
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
        friction: 0.1,
        restitution: 0.6,
        slop: 0.5,
    });

    // body.angle = Matter.Common.random(0, Math.PI * 2);

    return {body, bodyRadius, limbRadius};
}