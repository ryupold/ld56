import { H1, MAIN, Vode, resetID } from "./exports.js";
import { State, v } from "./state.js";

export const content = (s: State): Vode<State> => {
    resetID();

    return v([MAIN, { class: "content" },
        [H1, "Creature Grabber"]
    ]);

};