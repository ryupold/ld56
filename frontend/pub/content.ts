import { CANVAS, H1, MAIN, Vode, resetID } from "./exports.js";
import { initEngine } from "./game/boot.js";
import { State, v } from "./state.js";

export const content = (s: State): Vode<State> => {
    resetID();

    return v([MAIN, { class: "content" },
        [H1, "Creature Grabber"],
        [CANVAS, {
            id: "game-canvas",
            onMount: (ss: State, el: HTMLElement) => {
                const parent = el.parentNode; 
                initEngine(s, <HTMLCanvasElement>el);
                //matter.js changes parent in DOM for whatever reason
                if(el.parentNode !== parent) {
                    el.remove();
                    parent?.appendChild(el);
                }
            },
        }],
    ]);

};