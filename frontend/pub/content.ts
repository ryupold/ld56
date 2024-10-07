import { BUTTON, CANVAS, DIV, H1, MAIN, Vode, resetID } from "./exports.js";
import { initEngine } from "./game/boot.js";
import { moveChain, moveChainVertically } from "./game/chain.js";
import { closeClaw, openClaw } from "./game/claw.js";
import { CHAIN_MOVEMENT_DELTA } from "./game/constants.js";
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
            [BUTTON, {onclick: (ss: State, e: Event) => moveChain(ss, -CHAIN_MOVEMENT_DELTA)}, "<- drive"],
            [BUTTON, {onclick: (ss: State, e: Event) => moveChain(ss, CHAIN_MOVEMENT_DELTA)}, "drive ->"],
            [BUTTON, {onclick: (ss: State, e: Event) => moveChainVertically(ss, ss.chain.verticalMin)}, "⬆️"],
            [BUTTON, {onclick: (ss: State, e: Event) => moveChainVertically(ss, ss.chain.verticalMax)}, "🔽"],
            [BUTTON, {
                onclick: () => document.documentElement!.requestFullscreen(),
            }, "fullscreen"]
        ]
    ]);

};