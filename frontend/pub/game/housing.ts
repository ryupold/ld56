import { State } from "../state.js";
import { newModelID } from "./creature.js";
import { BodyOptions, MatterJs } from "./matter.js";
import { ModelType } from "./model.js";

declare var Matter: MatterJs;
const Engine = Matter.Engine,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector;

export function housingFloorWidth(s: State) { return s.screen.width - 200; }

export function createHousing(s: State) {
    const floorWidth = housingFloorWidth(s);
    const floorHeight = 30;
    const wallThickness = 10;
    const housingMaterial = <BodyOptions>{};

    const floor = Bodies.rectangle(
        floorWidth / 2,
        s.screen.height - floorHeight / 2,
        floorWidth, floorHeight, housingMaterial);
    Matter.Body.setStatic(floor, true);
    Composite.add(s.world, floor);
    s.models.push({
        id: newModelID(),
        type: ModelType.Housing,
        body: floor,
        img: s.images.housing.floor,
        w: floorWidth, h: floorHeight
    });

    const leftWall = Bodies.rectangle(
        wallThickness / 2,
        s.screen.height / 2,
        wallThickness, s.screen.height, housingMaterial);
    Matter.Body.setStatic(leftWall, true);
    Composite.add(s.world, leftWall);
    s.models.push({
        id: newModelID(),
        type: ModelType.Housing,
        body: leftWall,
        img: s.images.housing.left,
        w: wallThickness, h: s.screen.height
    });

    const rightSmallWall = Bodies.rectangle(
        floorWidth + wallThickness / 2,
        s.screen.height / 2 + s.screen.height / 3,
        wallThickness,
        s.screen.height / 3,
        housingMaterial);
    Matter.Body.setStatic(rightSmallWall, true);
    Composite.add(s.world, rightSmallWall);
    s.models.push({
        id: newModelID(),
        type: ModelType.Housing,
        body: rightSmallWall,
        img: s.images.housing.middle,
        w: wallThickness, h: s.screen.height / 3
    });

    const rightWall = Bodies.rectangle(
        s.screen.width - wallThickness / 2,
        s.screen.height / 2,
        wallThickness, s.screen.height, housingMaterial);
    Matter.Body.setStatic(rightWall, true);
    Composite.add(s.world, rightWall);
    s.models.push({
        id: newModelID(),
        type: ModelType.Housing,
        body: rightWall,
        img: s.images.housing.right,
        w: wallThickness, h: s.screen.height
    });
}
