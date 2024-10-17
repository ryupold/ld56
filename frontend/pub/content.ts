import { BUTTON, CANVAS, DIV, H1, MAIN, P, Vode, delay, resetID } from "./exports.js";
import { initEngine } from "./game/boot.js";
import { moveChain, moveChainVertically } from "./game/chain.js";
import { closeClaw, openClaw } from "./game/claw.js";
import { CHAIN_MOVEMENT_DELTA } from "./game/constants.js";
import { State, v } from "./state.js";

async function startGame(s: State, fullscreen: boolean) {
    const mainScreen = document.querySelector("#game-screen") as HTMLElement;
    if (fullscreen) {
        mainScreen.requestFullscreen();
        await delay(1000);
    }

    s.screen.width = Math.min(mainScreen.clientWidth, window.innerWidth);
    s.screen.height = Math.min(mainScreen.clientWidth / 16 * 9, window.innerHeight);
    const canvas = document.querySelector("#game-canvas") as HTMLCanvasElement;
    canvas.width = s.screen.width;
    canvas.height = s.screen.height;

    const parent = canvas.parentNode;
    initEngine(s, <HTMLCanvasElement>canvas);
    //matter.js changes parent in DOM for whatever reason
    if (canvas.parentNode !== parent) {
        canvas.remove();
        // parent?.appendChild(canvas);
        parent?.insertBefore(canvas, document.querySelector('#game-hud')!);
    };
}

export const content = (s: State): Vode<State> => {
    resetID();

    return v([MAIN, { id: "game-screen", class: "content" },
        // [H1, "Creature Grabber"],
        [CANVAS, {
            id: "game-canvas",
            onMount: (ss: State, el: HTMLElement) => {
                // const parent = el.parentNode;
                // initEngine(s, <HTMLCanvasElement>el);
                // //matter.js changes parent in DOM for whatever reason
                // if (el.parentNode !== parent) {
                //     el.remove();
                //     parent?.appendChild(el);
                // };
            },
            // onclick: (ss: State, e: Event) => {
            //     s.events.onClick.forEach(c => c(s, e as MouseEvent));
            // },
        }],
        [DIV, { id: 'game-hud' },
            [P, { class: "info" },
                `Press and hold 🟢 to move the claw to the left (it turns at the end). Once you release the button the claw tries to grab something and returns to the start to drop it. Then you can repeat until all you get all creatures.`],
            [P, { class: "info" }, "Please rotate your device to landscape before playing."],
            [BUTTON, {
                class: 'start-button',
                onclick: async (ss: State, e: Event) => {
                    (e.target as any)?.remove();
                    document.querySelectorAll('p.info').forEach(x => x.remove());
                    await startGame(ss, isMobile());
                },
            }, "start game"]
        ]
    ]);

};

const unusedButtons = [
    [BUTTON, { onclick: (ss: State, e: Event) => openClaw }, "open"],
    [BUTTON, { onclick: (ss: State, e: Event) => closeClaw }, "close"],
    [BUTTON, { onclick: (ss: State, e: Event) => moveChain(ss, -CHAIN_MOVEMENT_DELTA) }, "<- drive"],
    [BUTTON, { onclick: (ss: State, e: Event) => moveChain(ss, CHAIN_MOVEMENT_DELTA) }, "drive ->"],
    [BUTTON, { onclick: (ss: State, e: Event) => moveChainVertically(ss, ss.chain.verticalMin) }, "⬆️"],
    [BUTTON, { onclick: (ss: State, e: Event) => moveChainVertically(ss, ss.chain.verticalMax) }, "🔽"],
];

function isMobile() {
    return !!(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)
        || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)
        || navigator.userAgent.match(/Opera Mini/i)
        || navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i));
}
