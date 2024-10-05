import { createState, route, vode } from "./exports.js";

export const init = createState({
    route: route(window.location),    
});

export type State = typeof init;

export const v = vode<State>;