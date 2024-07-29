import * as THREE from "three";
import {Renderable} from "./renderable.ts";

export abstract class BasicTile implements Renderable {
  private _mesh: THREE.Mesh;

  protected abstract _imagePath:string;
  protected abstract _size:[number,number];

  id: number = -1;

  constructor() {
    const texture = new THREE.TextureLoader().load(this._imagePath);
    const geometry = new THREE.PlaneGeometry(this._size[0],this._size[1]);
    const material = new THREE.MeshBasicMaterial({map: texture});

    this._mesh = new THREE.Mesh(geometry, material);
  }

  private _setup() {

  }

  setId(id: number) {
    this.id = id;
  }

  setPosition([x,y]: [number, number]) {
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
