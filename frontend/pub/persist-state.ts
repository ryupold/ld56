import { Patch, merge } from "./exports.js";
import { State } from "./state.js";

export function persistState(s: State) {
    s.patch({ commands: { saveState: true } });
};

export function reloadState(init: State) {
    const loadedSubState = JSON.parse(sessionStorage.getItem("state") || "{}");
    const loadedState = <State>merge(init, loadedSubState, <Patch<State>>{
        diagnostics: { lastStatePersisted: Date.now() }
    });
    return loadedState;
}