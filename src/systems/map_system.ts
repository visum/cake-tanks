import { System } from "./system.ts";
import { firstComponentByTypeOrThrow } from "../world.ts";
import { Position } from "../components/position.ts";
import { Renderable } from "../components/renderable.ts";
import { World, Entity } from "../world.ts";


export enum TileType {
  WATER,
  GRASS,
  TREE,
  BASE,
  PILLBOX,
  WALL,
  ROAD,
}

const MAP_TILE_PIXEL_SIZE = 32;

const colorToType: Record<string, TileType> = {
  '51,204,102': TileType.GRASS,
  '0,51,0': TileType.TREE,
  '255,255,255': TileType.BASE,
  '0,0,0': TileType.ROAD,
  '0,255,255': TileType.WATER,
  '255,0,0': TileType.PILLBOX,
  '255,255,0': TileType.WALL,
};

export class MapSystem implements System {
  private _tiles: TileType[][] = [];
  private _world: World;
  private _mapEntities: Entity[][] = [];

  private _tileTypeToEntityFactory: Record<TileType, (x: number, y: number) => Entity> = {
    [TileType.TREE]: this._getTree,
    [TileType.GRASS]: this._getGrass,
    [TileType.BASE]: this._getBase
  };

  constructor(imagePath: string, world: World) {
    this._world = world;
    this._loadMapFromImage(imagePath);
  }

  process(world: World) {
    const viewport = world.getEntitiesByType('viewport')[0];
    const rect = firstComponentByTypeOrThrow(viewport, 'rect');

  }

  private _addEntities() {
    this._mapEntities = [];

    const tiles = this._tiles;
    for (let y = 0; y < tiles.length; y++) {
      this._mapEntities[y] = [];
      const row = tiles[y];
      for (let x = 0; x < row.length; x++) {
        const tile = row[x];
        const entityFactory = this._tileTypeToEntityFactory[tile];

        const entity = entityFactory.call(this, x, y);
        this._mapEntities[y][x] = entity;
      }
    }

    this._world.map = this._mapEntities;
  }


  private _loadMapFromImage(path: string) {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      throw new Error("failed to get context")
    }
    img.src = path;
    img.onload = () => {
      this._tiles = [];
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pixels = ctx.getImageData(0, 0, img.width, img.height).data;
      // the image is read from the top-left, so we need to
      // invert the y axis
      for (let y = canvas.height - 1; y >= 0; y--) {
        this._tiles[y] = [];
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];

          const pixel = `${r},${g},${b}`;

          this._tiles[y][x] = colorToType[pixel];
        }
      }
      this._addEntities();
    };

    img.onerror = function(error) {
      throw new Error(error.toString());
    }
  }

  private _getTree(x: number, y: number) {
    const e = this._world.getNewEntity("tree");
    const position: Position = {
      type: "position",
      values: {
        x: x * MAP_TILE_PIXEL_SIZE, y: y * MAP_TILE_PIXEL_SIZE,
        rotation: 0
      }
    };
    e.components.push(position);
    const renderable: Renderable = {
      type: "renderable",
      values: undefined
    };
    e.components.push(renderable);
    return e;
  }

  private _getGrass(x: number, y: number) {
    const e = this._world.getNewEntity("grass");
    const position: Position = {
      type: "position",
      values: {
        x: x * MAP_TILE_PIXEL_SIZE, y: y * MAP_TILE_PIXEL_SIZE, rotation: 0
      }
    }
    e.components.push(position);
    const renderable: Renderable = {
      type: "renderable",
      values: undefined
    };
    e.components.push(renderable);
    return e;
  }


  private _getBase(x: number, y: number) {
    const e = this._world.getNewEntity("base");
    const position: Position = {
      type: "position",
      values: {
        x: x * MAP_TILE_PIXEL_SIZE,
        y: y * MAP_TILE_PIXEL_SIZE,
        rotation: 0,
      }
    };
    e.components.push(position);
    const renderable: Renderable = {
      type: "renderable",
      values: undefined,
    };
    e.components.push(renderable);

    return e;
  }
}
