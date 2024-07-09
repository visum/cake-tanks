import * as THREE from "three";
const imagePath = "/tank-r.png";

export class Tank {
  private _mesh: THREE.Mesh;

  constructor() {
    const texture = new THREE.TextureLoader().load(imagePath);
    const geometry = new THREE.PlaneGeometry(32, 32);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    this._mesh = new THREE.Mesh(geometry, material);
  }

  setPosition([x, y]: [number, number]) {
    this._mesh.position.setX(x);
    this._mesh.position.setY(y);
  }

  setRotation(deg:number) {
    this._mesh.rotation.z = deg;
  }

  getThreeObject() {
    return this._mesh;
  }
}
