import * as THREE from "three";
import { BasicTile } from "./basic_tile.ts";

const imagePath = "/grass.png";
const texture = new THREE.TextureLoader().load(imagePath);

export class GrassThing extends BasicTile {
  protected _getTexture() {
    return texture;
  }

  get _size(): [number, number] {
    return [32, 32];
  }
}
