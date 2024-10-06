import { Effect, app } from "./exports.js";
import { reloadState } from './persist-state.js';
import { isDev } from './isdev.js';
import { content } from './content.js';
import { State, init } from "./state.js";
import { initEngine } from "./game/boot.js";

const node = document.getElementById('app')!;

app<State>(node, reloadState(init), content);

///// DEBUG STUFF \\\\\

// if (isDev()) {
//     async function doDebugStuff() {

//         // Warns about elements wider than the viewport
//         setInterval(() => {
//             const all = document.querySelectorAll('*');
//             const tooWide: { element: HTMLElement, offby: number }[] = [];
//             for (const e of all) {
//                 if (e instanceof HTMLElement) {
//                     if (e.offsetWidth > document.documentElement.offsetWidth) {
//                         tooWide.push({ element: e, offby: e.offsetWidth - document.documentElement.offsetWidth });
//                     }
//                 }
//             }

//             if (tooWide.length > 0)
//                 console.warn('Elements wider than viewport\n', ...tooWide);

//         }, 5000);
//     }

//     doDebugStuff();
// }


