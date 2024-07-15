import "./style.css";
import * as THREE from "three";
import { World } from "./world";
import { ScreenRenderer } from "./systems/screen_renderer";

import { System } from "./systems/system";
import { Position } from "./components/position";
import { Renderable } from "./components/renderable";
import { KeyabordInput } from "./systems/keyboard_input";
import { BulletSystem } from "./systems/bullet";

const WIDTH = 800;
const HEIGHT = 600;

const appElement = document.querySelector("#app");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.OrthographicCamera(
  WIDTH / -2,
  WIDTH / 2,
  HEIGHT / 2,
  HEIGHT / -2,
  -100,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
appElement?.appendChild(renderer.domElement);

const world = new World();

// tank
const tank = world.getNewEntity("tank");
tank.type = "tank";
const position: Position = {
  type: "position",
  values: {
    x: 0,
    y: 0,
    rotation: 0,
  },
};
tank.components.push(position);
const renderable: Renderable = {
  type: "renderable",
  values: undefined,
};
tank.components.push(renderable);
world.add(tank);

// keyboard input
const keyboardInput = new KeyabordInput(document.body, tank);

// systems
const systems: System[] = [];
systems.push(new ScreenRenderer(scene));
systems.push(keyboardInput);
systems.push(new BulletSystem());

renderer.setAnimationLoop(process);

function process() {
  for (let i = 0; i < systems.length; i++) {
    const sys = systems[i];
    sys.process(world);
  }
  systems[0].process(world);

  renderer.render(scene, camera);
}
