declare var p5: any;

export function initP5(
    setupFn: (r: Sketch) => void,
    drawFn: (r: Sketch) => void,
) {
    new p5((sketch: Sketch) => {
        (<any>sketch).setup = setupFn.bind(null, sketch);
        (<any>sketch).draw = drawFn.bind(null, sketch);
    });
}

export type Sketch = {
    //canvas 
    createCanvas: ((width: number, height: number, renderer?: "P2D" | "WEBGL", canvas?: HTMLCanvasElement) => void) | ((width: number, height: number, canvas?: HTMLCanvasElement) => void);
    resizeCanvas: (w: number, h: number) => void;

    //color
    background: (...colorArgs: any[]) => void;
    fill: (...colorArgs: any[]) => void;
    stroke: (...colorArgs: any[]) => void;
    color: (...colorArgs: any[]) => any;
    strokeWeight: (w: number) => void;

    //shapes
    circle: (x: number, y: number, diameter: number) => void;
    arc: (x: number, y: number, w: number, h: number, start: number, stop: number, mode?: "CHORD" | "PIE" | "OPEN", detail?: number) => void;
    line: ((x1: number, y1: number, x2: number, y2: number) => void) | ((x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => void);
    /** https://p5js.org/reference/p5/rect/ */
    rect: ((x: number, y: number, w: number, h?: number, tl?: number, tr?: number, br?: number, bl?: number) => void) | ((x: number, y: number, w: number, h?: number, detailX?: number, detailY?: number) => void);

    //images
    image: ((img: any, destX: number, destY: number, destW: number, destH: number, srcX: number, srcY: number, srcW?: number, srcH?: number, fit?: "CONTAIN" | "COVER", xAlign?: "LEFT" | "RIGHT" | "CENTER", yAlign?: "TOP" | "BOTTOM" | "CENTER") => void) | ((img: any, x: number, y: number, w?: number, h?: number) => void);
    imageMode: (mode: "CORNER" | "CORNERS" | "CENTER") => void;
    loadImage: (path: string, success?: () => void, error?: (err: any) => void) => void;
    saveGif: (file: string, duration: number, options?: {delay?: number, units?: "seconds" | "frames", silent?: boolean, notificationDuration?: number, 
        /** default: 'progressBar' */ notificationID?: string}) => void

    //transforms
    translate: (x: number, y: number, z?: number) => void;
    rotate: (angle: number, axis?: any) => void;
    scale: (x: number, y?: number, z?: number) => void;
    applyMatrix: () => void;
    resetMatrix: () => void;

    //text
    textSize: (s: number) => void;
    text: (text: string, x: number, y: number, maxW?: number, maxH?: number) => void;
    describe: (text: string) => void;

    //math
    createVector: (x?: number, y?: number, z?: number) => P5Vector;
    Vector: { fromAngle: (angle: number) => P5Vector };

    //hardware
    mouseX: number;
    mouseY: number;
    pmouseX: number;
    pmouseY: number;
    mouseIsPressed: boolean;
    mouseButton: string;
    /** https://p5js.org/reference/p5/requestPointerLock/ */
    requestPointerLock: () => void;
    touches: {x: number, y: number}[];
};

export type P5Vector = {
    x: number;
    y: number;
    z: number;

    mag: () => number;
    magSq: () => number;

    set: ((x?: number, y?: number, z?: number) => void) | ((v: P5Vector) => void);
    add: (...args: any[]) => void;
    mult: (...args: any[]) => void;
    lerp: ((x: number, y: number, z: number, amt: number) => void) | ((v: P5Vector, amt: number) => void);
    rotate: (angle: number) => void;
    normalize: () => void;
    dist: (v: P5Vector) => void;
};