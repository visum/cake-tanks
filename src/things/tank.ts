import * as THREE from "three";
import { Renderable } from "./renderable";
const imagePath = "/tank-r.png";

export class Tank implements Renderable {
  private _mesh: THREE.Mesh;

  id: number = -1;

  constructor() {
    const texture = new THREE.TextureLoader().load(imagePath);
    const geometry = new THREE.PlaneGeometry(32, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture });

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
