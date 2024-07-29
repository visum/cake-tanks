import * as THREE from "three";
import {Renderable} from "./renderable.ts";
import {BasicTile} from "./basic_tile.ts";

export class TreeThing extends BasicTile {
  get _size() {
    return [32, 32];
  }

  get _imagePath() {
    return "/tree.png";
  }
}

