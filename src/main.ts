import "./style.css";
import * as THREE from "three";
import { Tank } from "./things/tank";
import { KeyboardInput } from "./input/keyboard";
import { InputType } from "./input/input_device";

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

const tank = new Tank();
const tankPosition: [number, number] = [0, 0];
let tankRotation = 0;

scene.add(tank.getThreeObject());

camera.position.z = 1;

function animate() {
  renderer.render(scene, camera);
  tank.setPosition(tankPosition);
  tank.setRotation(tankRotation);
}

renderer.setAnimationLoop(animate);

const keyboardInput = new KeyboardInput();

keyboardInput.attach((e) => {
  if (e === InputType.UP) {
    const [dX, dY] = directionDistanceToDxDy(tankRotation, 1);
    tankPosition[0] -= dX;
    tankPosition[1] += dY;
  }
  if (e === InputType.DOWN) {
    const [dX, dY] = directionDistanceToDxDy(tankRotation, -1);
    tankPosition[0] -= dX;
    tankPosition[1] += dY;
  }
  if (e === InputType.RIGHT) {
    tankRotation -= 0.1;
  }
  if (e === InputType.LEFT) {
    tankRotation += 0.1;
  }
});

keyboardInput.start();

function directionDistanceToDxDy(direction: number, distance: number) {
  const dX = distance * Math.sin(direction);
  const dY = distance * Math.cos(direction);
  return [dX, dY];
}
