import "./style.css";
import * as THREE from "three";
import { World } from "./world";
import { ScreenRenderer } from "./systems/screen_renderer";

import { System } from "./systems/system";
import { Position } from "./components/position";
import { Renderable } from "./components/renderable";
import { KeyabordInput } from "./systems/keyboard_input";
import { Movement } from "./components/movement";
import { TankSystem } from "./systems/tank";
import { AgeSystem } from "./systems/age.ts";
import { MovementSystem } from "./systems/movement.ts";
import { MapSystem } from "./systems/map_system.ts";
import { Rect } from "./components/rect.ts";
import { CameraCenteringSystem } from "./systems/camera_centering_system.ts";


const WIDTH = 800;
const HEIGHT = 600;

const appElement = document.querySelector("#app");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.OrthographicCamera(
  0,
  WIDTH,
  HEIGHT,
  0,
  -100,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
appElement?.appendChild(renderer.domElement);

const world = new World();

(window as any).world = world;

// tank
const tank = world.getNewEntity("tank");
tank.type = "tank";
const position: Position = {
  type: "position",
  values: {
    x: 400,
    y: 300,
    rotation: 0,
  },
};
tank.components.push(position);
const renderable: Renderable = {
  type: "renderable",
  values: undefined,
};
tank.components.push(renderable);
const movement: Movement = {
  type: "movement",
  values: {
    direction: 0,
    speed: 0,
  },
};
tank.components.push(movement);
world.add(tank);

// viewport
const viewport = world.getNewEntity("viewport");
viewport.type = "viewport";

const viewportRect: Rect = {
  type: "rect",
  values: {
    width: WIDTH,
    height: HEIGHT,
    x: 0,
    y: 0,
  }
}
viewport.components.push(viewportRect);

world.add(viewport);

// keyboard input
const keyboardInput = new KeyabordInput(document.body, tank, world);

// systems
const systems: System[] = [];
systems.push(new ScreenRenderer(scene, world));
systems.push(keyboardInput);
systems.push(new AgeSystem());
systems.push(new MovementSystem());
systems.push(new TankSystem());
systems.push(new MapSystem("/map1.png", world));
systems.push(new CameraCenteringSystem(camera));

renderer.setAnimationLoop(process);

function process() {
  for (let i = 0; i < systems.length; i++) {
    const sys = systems[i];
    sys.process(world);
  }
  systems[0].process(world);

  renderer.render(scene, camera);
}
