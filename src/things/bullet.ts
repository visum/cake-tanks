import * as THREE from "three";
import { Renderable } from "./renderable";

const imagePath = "/bullet.png";
const texture = new THREE.TextureLoader().load(imagePath);

export class Bullet implements Renderable {
  private _mesh: THREE.Mesh;

  id: number = -1;

  constructor() {
    const geometry = new THREE.PlaneGeometry(16, 16);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

    this._mesh = new THREE.Mesh(geometry, material);
  }

  setId(id: number) {
    this.id = id;
  }

  setPosition([x, y]: [number, number]) {
    this._mesh.position.setX(x);
    this._mesh.position.setY(y);
  }

  setRotation(rad: number) {
    this._mesh.rotation.z = rad;
  }

  getMesh() {
    return this._mesh;
  }
}
