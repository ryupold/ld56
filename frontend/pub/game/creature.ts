import { Body, MatterJs } from "./matter.js";

export type Creature = {};

declare var Matter: MatterJs;

export function createCreatureBody(x: number, y: number) {
    const group = Matter.Body.nextGroup(true);

    const limbs = <Body[]>[];

    return Matter.Body.create({
        parts: [
            Matter.Bodies.circle(x, y, 20, { collisionFilter: { group } }),
            ...limbs,
        ],
    });
}