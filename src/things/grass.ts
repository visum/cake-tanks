import {BasicTile} from "./basic_tile.ts";

export class GrassThing extends BasicTile {

  get _imagePath() {
    return "/grass.png";
  }

  get _size() {
    return [32,32];
  }
}
