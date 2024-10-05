import { BUTTON, ChildVode, Props, merge, mergeClass } from "../exports.js";
import { State } from "../state.js";
import { Comp } from "./component.js";

export const Button = (props?: Props<State> & { enabled?: boolean }, ...children: ChildVode<State>[]) => Comp<State>("button", BUTTON, merge(props, {
    class: mergeClass(props?.class, { enabled: props?.enabled === undefined || props.enabled, is: true, "soft-border": true }),
}), 
...children);


