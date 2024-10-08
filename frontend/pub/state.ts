import { createState, route, vode, Patch, Effect } from "./exports.js";
import { mouseClick } from "./game/click.js";
import { World, Body, Mouse, Composite, Constraint } from "./game/matter.js";
import { Model } from "./game/model.js";
import { Image } from "./game/p5.js";

export const init = createState({
    route: route(window.location),

    screen: { 
        width: Math.min(document.documentElement.clientWidth, window.innerWidth), 
        height: Math.min(document.documentElement.clientWidth / 16 * 9, window.innerHeight),
     },

    world: <World><unknown>undefined,
    
    chain: {
        verticalMin: 0,
        verticalMax: 0,
        movingHorizontally: false,
        movingVertically: false,
        anchor: <Body><unknown>undefined,
        claw: {
            comp: <Composite><unknown>undefined,
            clawing: false,
            state: <'open' | 'close'>'open',
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
        score: 0,
        state: <'idle' | 'movingForward' | 'movingBack' | 'dropping' | 'pulling' | 'returning'>'idle',
    },

    events: {
        onClick: <((_: any, e: MouseEvent)=>unknown)[]>[],
    },

    hud: {
        clawButton: {
            x: 0, y: 0, w: 50, h: 50,
            visible: false,
            pressed: false,
        },
        score: {
            x: 0, y: 0, w: 50, h: 50,
            visible: false,
        },
    }
});

init.events.onClick.push(mouseClick);

export type State = typeof init;

export const v = vode<State>;