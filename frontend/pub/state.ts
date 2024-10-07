import { createState, route, vode, Patch, Effect } from "./exports.js";
import { mouseClick } from "./game/click.js";
import { World, Body, Mouse, Composite, Constraint } from "./game/matter.js";

export const init = createState({
    route: route(window.location),

    screen: { width: 600, height: 400 },

    world: <World><unknown>undefined,
    
    chain: {
        anchor: <Body><unknown>undefined,
        claw: {
            comp: <Composite><unknown>undefined,
            clawing: false,
            distance: {
                upperMin: 60, upperMax: 80, lowerMin: 10, lowerMax: 100,
                upperConstraint: <Constraint><unknown>undefined, 
                lowerConstraint: <Constraint><unknown>undefined,
            }
        },

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