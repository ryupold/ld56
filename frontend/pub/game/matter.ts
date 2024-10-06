
/** https://brm.io/matter-js/docs/classes */
export type MatterJs = {
    Engine: EngineModule,
    Body: BodyModule,
    Bodies: BodiesModule,
    Composite: CompositeModule,
    Composites: any,
    Constraint: ConstraintModule,
    MouseConstraint: any,
    Mouse: any,
    Events: EventsModule,
    Render: any,
    Runner: any,
    Vector: any,
};

export type EngineModule = { create: () => Engine, run: (engine: Engine) => void };
export type Engine = { gravity: { x: number, y: number }, world: World };
export type World = {};

export type CompositeModule = {
    add: (composite: Composite, object: Composite | object | object[]) => void;
    create: (options: {bodies?: Body[], composites?: Composite[], constraints?: Constraint[]}) => Composite;
};
export type Composite = {};
export type BodyModule = {
    applyForce: (body: Body, position: V2, force: V2) => void;

    create: (options?: BodyOptions) => Body;

    rotate: (body: Body, rotation: number, point?: V2, updateVelocity?: boolean) => void;
    scale: (body: Body, scaleX: number, scaleY: number, point?: V2) => void;
    translate: (body: Body, translation: V2) => void;

    setAngle: (body: Body, rotation: number, updateVelocity?: boolean) => void;
    setAngularVelocity: (body: Body, speed: number) => void;
    setAngularSpeed: (body: Body, speed: number) => void;
    setStatic: (body: Body, isStatic: boolean) => void;
    setDensity: (body: Body, density: number) => void;
    setInertia: (body: Body, inertia: number) => void;
    setMass: (body: Body, mass: number) => void;
    setPosition: (body: Body, pos: V2, updateVelocity?: boolean) => void;
    setVelocity: (body: Body, velo: V2) => void;
    setVertices: (body: Body, verices: V2[]) => void;
    setParts: (body: Body, parts: Body[], autoHull?: boolean) => void;
};

export type Body = {
    id: number,
    label: string,
    type: "body" | "constraint" | "composite",

    parent: Body,
    parts: Body[],
    vertices: V2[],

    density: number,
    area: number,
    mass: number,
    inertia: number,

    angle: number,
    position: V2,
    velocity: V2,

    force: V2,
    torque: number,
    angularVelocity: number,
    angularSpeed: number,

    friction: number,
    frictionAir: number,
    frictionStatic: number,
    restitution: number,
    slop: number,

    collisionFilter: { group: number, category: number, mask: number },
    isSensor: boolean,
    isStatic: boolean,
    isSleeping: boolean,

    timeScale: number,
    sleepThreshold: number,

    render: object,
};

export type BodyOptions = {
    label?: string,

    angle?: number,

    /** default: 0.001 */
    density?: number,

    position?: V2,
    velocity?: V2,
    force?: V2,

    friction?: number,
    frictionAir?: number,
    frictionStatic?: number,
    restitution?: number,
    slop?: number,
    /** default: {group: 0, category: 1, mask: -1} */
    collisionFilter?: { group?: number, category?: number, mask?: number },
    isSensor?: boolean,

    timeScale?: number,
    sleepThreshold?: number,

    render?: { visible?: boolean, type?: 'line' | 'fill', anchors?: boolean }
};

export type BodiesModule = {
    circle: (x: number, y: number, radius: number, options?: BodyOptions, maxSides?: number) => Body,
    fromVertices: (x: number, y: number, vertexSets: V2[], options?: BodyOptions, ...otherArgs: any[]) => Body,
    polygon: (x: number, y: number, sides: number, radius: number, options?: BodyOptions) => Body,
    rectangle: (x: number, y: number, width: number, height: number, options?: BodyOptions) => Body,
    trapezoid: (x: number, y: number, width: number, height: number, slope: number, options?: BodyOptions) => Body,
};

export type V2 = { x: number, y: number };

export type EventsModule = {
    on: (target: Body, event: "sleepStart" | "sleepEnd", callback: (evt: { source: Body, name: string }) => void) => void
};

export type ConstraintModule = {

};

export type Constraint = {};