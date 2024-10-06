import { createState, route, vode } from "./exports.js";
import { World, Body, Mouse } from "./game/matter.js";

export const init = createState({
    route: route(window.location),

    screen: { width: 600, height: 480 },

    world: <World><unknown>undefined,
    mouse: <Mouse><unknown>undefined,

    game: {
        housing: <Body[]>[]
    }
});

export type State = typeof init;

export const v = vode<State>;