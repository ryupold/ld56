import { MatterJs, Composite } from "./matter.js";

declare var Matter: MatterJs;

/** change a composite's bodies static state */
export function setStatic(comp: Composite, isStatic: boolean) {
    for (const b of Matter.Composite.allBodies(comp)) {
        Matter.Body.setStatic(b, isStatic);
    }
}