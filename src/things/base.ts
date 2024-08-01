import * as THREE from "three";
import { BasicTile } from "./basic_tile.ts";

const imagePath = "/base.png";
const texture = new THREE.TextureLoader().load(imagePath);


export class BaseThing extends BasicTile {
  get _size(): [number, number] {
    return [32, 32];
  }

  protected _getTexture() {
    return texture;
  }
}
