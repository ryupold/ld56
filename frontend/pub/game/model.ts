import { Body, Composite } from "./matter.js"
import { Image } from "./p5.js"

export type Model = {
    body: Body,
    img: Image,
    w: number,
    h: number,
}