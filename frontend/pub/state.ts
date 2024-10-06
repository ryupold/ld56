import { createState, route, vode, Patch, Effect } from "./exports.js";
import { mouseClick } from "./game/click.js";
import { World, Body, Mouse, Composite, Constraint } from "./game/matter.js";

export const init = createState({
    route: route(window.location),

    screen: { width: 600, height: 480 },

    world: <World><unknown>undefined,
    
    chain: {
        anchor: <Body><unknown>undefined,
        claw: {
            comp: <Composite><unknown>undefined,
            distance: {
                upper: 80, lower: 100,
                upperConstraint: <Constraint><unknown>undefined, 
                lowerConstraint: <Constraint><unknown>undefined,
            }
        },

    },

    game: {
        housing: <Body[]>[]
    },

    events: {
        onClick: <((s: any, e: MouseEvent)=>unknown)[]>[mouseClick],
    },
});

export type State = typeof init;

export const v = vode<State>;