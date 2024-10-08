import { Body, Composite } from "./matter.js"
import { Image } from "./p5.js"

export enum ModelType { Creature, ChainSegment, Claw, Housing }

export type Model = {
    id: number,
    type: ModelType,
    body: Body,
    img: Image,
    w: number,
    h: number,
    // offsetX?: number,
    // offsetY?: number,
    // offsetAngle?: number,
}