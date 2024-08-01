import * as THREE from "three";
import { Renderable } from "./renderable.ts";

export abstract class BasicTile implements Renderable {
  private _mesh: THREE.Mesh | null = null;

  protected abstract _size: [number, number];

  id: number = -1;

  constructor() {
    this._setup();
  }

  protected abstract _getTexture(): THREE.Texture;

  protected _setup() {
    const texture = this._getTexture();
    const geometry = new THREE.PlaneGeometry(this._size[0], this._size[1]);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    this._mesh = new THREE.Mesh(geometry, material);
  }

  get mesh() {
    if (this._mesh == null) {
      throw new Error("No mesh yet");
    }
    return this._mesh;
  }

  setId(id: number) {
    this.id = id;
  }

  setPosition([x, y]: [number, number]) {
    this.mesh.position.setX(x);
    this.mesh.position.setY(y);
  }

  setRotation(rad: number) {
    this.mesh.rotation.z = rad;
  }

  getMesh() {
    return this.mesh;
  }
}
