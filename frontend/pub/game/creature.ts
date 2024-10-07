import { Body, MatterJs } from "./matter.js";

export type Creature = {};

declare var Matter: MatterJs;

export function createCreatureBody(x: number, y: number) {
    
    const bodyRadius = 10;
    const limbRadius = 5;
    const group = Matter.Body.nextGroup(true);

    const limbs = <Body[]>[];
    
    for (let i = 0; i < 5; i++) {
        let direction = Matter.Vector.rotate({ x: 1, y: 0 }, i * (Math.PI*2 / 5));
        direction = Matter.Vector.mult(direction, bodyRadius + limbRadius*3);
        console.log(direction);
        limbs.push(
            Matter.Bodies.circle(x + direction.x, y + direction.y, limbRadius, {
                collisionFilter: { group },
                density: 0.000001
            })
        );
    }

    return Matter.Body.create({
        parts: [
            Matter.Bodies.circle(x, y, 20, { density: 0.000001, collisionFilter: { group } }),
            ...limbs,
        ],
    });
}