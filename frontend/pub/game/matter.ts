
/** https://brm.io/matter-js/docs/classes
 * 
 * declare var Matter: MatterJs;
 */
export type MatterJs = {
    Engine: EngineModule,
    Body: BodyModule,
    Bodies: BodiesModule,
    Common: CommonModule,
    Composite: CompositeModule,
    Composites: CompositesModule,
    Constraint: ConstraintModule,
    Events: EventsModule,
    MouseConstraint: any,
    Mouse: MouseModule,
    Query: QueryModule,
    Render: any,
    Runner: any,
    Vector: VectorModule,
};

export type EngineModule = { create: () => Engine, run: (engine: Engine) => void };
export type Engine = { gravity: { x: number, y: number }, world: World };
export type World = {};

export type CompositeModule = {
    add: (composite: Composite | World, object: Composite | Body | Constraint | Composite[] | Body[] | Constraint[]) => void;
    create: (options: { label?: string, bodies?: Body[], composites?: Composite[], constraints?: Constraint[] }) => Composite;
    remove: (composite: Composite | World, object: Composite | Body | Constraint | Composite[] | Body[] | Constraint[]) => Composite

    rotate: (comp: Composite, rotation: number, point: V2, recursive?: boolean) => void;
    scale: (comp: Composite, scaleX: number, scaleY: number, point: V2, recursive?: boolean) => void;
    translate: (comp: Composite, translation: V2, recursive?: boolean) => void;

    clear: (comp: Composite, keepStatic: boolean, deep?: boolean) => void;
    allBodies: (comp: Composite) => Body[];
    allComposites: (comp: Composite) => Composite[];
    allConstraints: (comp: Composite) => Constraint[];
};

export type CompositesModule = {
    chain: (composite: Composite, xOffsetA: number, yOffsetA: number, xOffsetB: number, yOffsetB: number, options?: ConstraintOptions) => Composite;
};

export type Composite = {
    id: number,
    label: string,
    type: "composite",

    bodies: Body[],
    composites: Composite[],
    constraints: Constraint[],
};
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

    nextCategory: () => number;
    nextGroup: (isNonColliding?: boolean) => number;
};

export type Body = {
    id: number,
    label: string,
    type: "body",

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

    parts?: Body[],

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
    create: (options?: ConstraintOptions) => Constraint;
};

export type ConstraintOptions = {
    label?: string,

    bodyA?: Body,
    pointA?: V2,
    angleA?: number,
    length?: number,

    bodyB?: Body,
    pointB?: V2,
    angleB?: number,

    stiffness?: number,
    angularStiffness?: number,
    damping?: number,
};

export type Constraint = {
    id: number,
    label: string,
    type: "constraint",

    length: number,
    stiffness: number,
    angularStiffness: number,
    damping: number,
};

export type VectorModule = {
    clone: (x: V2) => V2;
    neg: (x: V2) => V2;

    add: (a: V2, b: V2, output?: V2) => V2;
    sub: (a: V2, b: V2, output?: V2) => V2;
    div: (v: V2, s: number) => V2;
    mult: (v: V2, s: number) => V2;

    angle: (a: V2, b: V2) => number;
    cross: (a: V2, b: V2) => number;
    cross3: (a: V2, b: V2, c: V2) => number;
    dot: (a: V2, b: V2) => number;

    magnitude: (a: V2) => number;
    magnitudeSquared: (a: V2) => number;
    normalise: (a: V2) => V2;

    rotate: (v: V2, angle: number, output?: V2) => V2;
    rotateAbout: (v: V2, angle: number, point: V2, output?: V2) => V2;
};

export type MouseModule = {
    create: (element: HTMLElement) => Mouse;
};

export type Mouse = {
    x: number,
    y: number,
};

export type CommonModule = {
    choose: <T>(choises: T[]) => T;
    clamp: (v: number, min: number, max: number) => number;
    sign: (v: number) => number;
    random: (min: number, max: number) => number;
    shuffle: <T>(list: T[]) => T[]
}


export type QueryModule = {
    collides: (body: Body, bodies: Body[]) => Collision[];
    points: (bodies: Body[], point: V2) => Body[];
};

export type Collision = {
    bodyA: Body,
    bodyB: Body,
    parentA: Body,
    parentB: Body,
    collided: boolean,
    normal: V2,
    pair: Pair,
    depth: number,
    penetration: V2,
    supportCount: number,
    tangent: V2,
    supports: V2[],
};

export type Pair = {

};