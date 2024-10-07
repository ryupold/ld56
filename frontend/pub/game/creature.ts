import { Body, MatterJs } from "./matter.js";

export type Creature = {};

declare var Matter: MatterJs;

export function createCreatureBody(x: number, y: number) {
    const bodyRadius = Matter.Common.random(5, 15);
    const limbRadius = Matter.Common.random(2, 8);
    const group = Matter.Body.nextGroup(true);

    const limbs = <Body[]>[];
    
    for (let i = 0; i < 5; i++) {
        let direction = Matter.Vector.rotate({ x: 1, y: 0 }, i * (Math.PI*2 / 5));
        direction = Matter.Vector.mult(direction, bodyRadius + limbRadius);
        limbs.push(
            Matter.Bodies.circle(x + direction.x, y + direction.y, limbRadius, {
                collisionFilter: { group },
                density: 0.000001
            })
        );
    }

    const body = Matter.Body.create({
        parts: [
            Matter.Bodies.circle(x, y, bodyRadius, { density: 0.000001, collisionFilter: { group } }),
            ...limbs,
        ],
    });

    return {body, bodyRadius, limbRadius};
}