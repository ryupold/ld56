import { createState, route, vode, Patch, Effect } from "./exports.js";
import { mouseClick } from "./game/click.js";
import { World, Body, Mouse, Composite, Constraint } from "./game/matter.js";
import { Model } from "./game/model.js";
import { Image } from "./game/p5.js";

export const init = createState({
    route: route(window.location),

    screen: { width: document.documentElement.clientWidth, height: document.documentElement.clientWidth / 16 * 9 },

    world: <World><unknown>undefined,
    
    chain: {
        verticalMin: 0,
        verticalMax: 0,
        moving: false,
        anchor: <Body><unknown>undefined,
        claw: {
            comp: <Composite><unknown>undefined,
            clawing: false,
            distance: {
                upperConstraint: <Constraint><unknown>undefined, 
                lowerConstraint: <Constraint><unknown>undefined,
            }
        },

    },

    models: <Model[]>[],
    images: {
        creatures: <Image[]>[],
    },

    game: {
        housing: <Body[]>[]
    },

    events: {
        onClick: <((_: any, e: MouseEvent)=>unknown)[]>[],
    },
});

init.events.onClick.push(mouseClick);

export type State = typeof init;

export const v = vode<State>;