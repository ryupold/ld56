import { ChildVode, Props, Tag, merge, mergeClass, vode } from "../exports.js";

export const noProps: Props<any> | undefined = undefined;

export const Comp = <S>(name: string, tag: Tag, props?: Props<S>, ...children: ChildVode<S>[]) =>
    vode<S>(tag, merge(props, {
        class: mergeClass('comp-' + name, props?.class)
    }), ...children);


export class TabIndex {
    constructor(public index: number = 1) { }
    next(incrementAfter: number = 1) { try { return 0; /*this.index*/ } finally { this.index += incrementAfter; } }
};