import { BUTTON, CANVAS, DIV, H1, MAIN, Vode, resetID } from "./exports.js";
import { initEngine } from "./game/boot.js";
import { closeClaw, moveClaw, openClaw, moveClawVertically } from "./game/claw.js";
import { State, v } from "./state.js";

export const content = (s: State): Vode<State> => {
    resetID();

    return v([MAIN, { class: "content" },
        // [H1, "Creature Grabber"],
        [CANVAS, {
            id: "game-canvas",
            onMount: (ss: State, el: HTMLElement) => {
                const parent = el.parentNode; 
                initEngine(s, <HTMLCanvasElement>el);
                //matter.js changes parent in DOM for whatever reason
                if(el.parentNode !== parent) {
                    el.remove();
                    parent?.appendChild(el);
                };
            },
            onclick: (ss: State, e: Event) => {
                s.events.onClick.forEach(c => c(s, e as MouseEvent));
            },

        }],
        [DIV, {}, 
            [BUTTON, {onclick: (ss: State, e: Event) => openClaw}, "open"],
            [BUTTON, {onclick: (ss: State, e: Event) => closeClaw}, "close"],
            [BUTTON, {onclick: (ss: State, e: Event) => moveClaw(ss, -100)}, "<- drive"],
            [BUTTON, {onclick: (ss: State, e: Event) => moveClaw(ss, 100)}, "drive ->"],
            [BUTTON, {onclick: (ss: State, e: Event) => moveClawVertically(ss, -300)}, "⬆️"],
            [BUTTON, {onclick: (ss: State, e: Event) => moveClawVertically(ss, 0)}, "🔽"],
            [BUTTON, {
                onclick: () => document.documentElement!.requestFullscreen(),
            }, "fullscreen"]
        ]
    ]);

};