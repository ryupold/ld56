import { State } from "../state.js";
import { BodyOptions, MatterJs } from "./matter.js";

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

    const leftWall = Bodies.rectangle(
        wallThickness / 2,
        s.screen.height / 2,
        wallThickness, s.screen.height, housingMaterial);
    Matter.Body.setStatic(leftWall, true);
    Composite.add(s.world, leftWall);

    const rightSmallWall = Bodies.rectangle(
        floorWidth + wallThickness / 2,
        s.screen.height / 2 + s.screen.height / 3,
        wallThickness,
        s.screen.height / 3,
        housingMaterial);
    Matter.Body.setStatic(rightSmallWall, true);
    Composite.add(s.world, rightSmallWall);

    const rightWall = Bodies.rectangle(
        s.screen.width - wallThickness / 2,
        s.screen.height / 2,
        wallThickness, s.screen.height, housingMaterial);
    Matter.Body.setStatic(rightWall, true);
    Composite.add(s.world, rightWall);
}
