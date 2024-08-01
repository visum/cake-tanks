import { World, firstComponentByTypeOrThrow, Entity } from "../world";
import { System } from "./system";
import { Tank } from "../things/tank";
import { Bullet } from "../things/bullet";
import { Renderable } from "../things/renderable";
import * as THREE from "three";
import { Position } from "../components/position";
import { Rect } from "../components/rect";
import { TreeThing } from "../things/tree.ts";
import { GrassThing } from "../things/grass.ts";
import { BaseThing } from "../things/base.ts";
import { RoadThing } from "../things/road.ts";
import { WallThing } from "../things/wall.ts";
import { PillboxThing } from "../things/pillbox.ts";

/*
Scene Renderer
Render renderable entities to a ThreeJS scene.

Reads:
- "renderable"
- "position"
- "rotation"

Writes:
(none)

Adds:
(none)
*/

type RenderableConstructor = new () => Renderable;

const typeToRenderable: Record<string, RenderableConstructor> = {
  tank: Tank,
  bullet: Bullet,
  tree: TreeThing,
  grass: GrassThing,
  base: BaseThing,
  road: RoadThing,
  wall: WallThing,
  pillbox: PillboxThing,
};

export class ScreenRenderer implements System {
  private _scene: THREE.Scene;
  private _renderables = new Map<number, Renderable>();
  private _entitiesInScene = new Set<Entity>();
  private _world: World;

  constructor(scene: THREE.Scene, world: World) {
    this._scene = scene;
    this._world = world;
  }

  process(world: World): void {
    const viewport = world.getEntitiesByType('viewport')[0];
    const viewportRect = firstComponentByTypeOrThrow(viewport, "rect") as Rect;
    const collection = new Set<Entity>();

    this._gatherDynamicEntities(viewportRect, collection);
    this._gatherMapEntities(viewportRect, collection);
    this._renderEntities(collection);
  }

  private _gatherDynamicEntities(viewportRect: Rect, collection: Set<Entity>) {
    const world = this._world;
    const entities = world.getEntitiesWithComponentTypes([
      "renderable",
      "position",
    ]);

    const rectXMin = viewportRect.values.x;
    const rectXMax = viewportRect.values.x + viewportRect.values.width;
    const rectYMin = viewportRect.values.y;
    const rectYMax = viewportRect.values.y + viewportRect.values.height;

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const position = firstComponentByTypeOrThrow(entity, "position") as Position;
      if (position.values.x > rectXMin && position.values.x < rectXMax && position.values.y > rectYMin && position.values.y < rectYMax) {
        collection.add(entity);
      }
    }
  }

  private _gatherMapEntities(viewportRect: Rect, collection: Set<Entity>) {
    const world = this._world;
    const entities = world.map;
    const yMin = Math.max(Math.floor(viewportRect.values.y / 32), 0);
    const yMax = Math.ceil((viewportRect.values.y + viewportRect.values.height) / 32) + 1;
    const xMin = Math.floor(viewportRect.values.x / 32);
    const xMax = Math.floor((viewportRect.values.x + viewportRect.values.width) / 32) + 1;

    const visibleRows = entities.slice(yMin, yMax);
    for (let i = 0; i < visibleRows.length; i++) {
      const row = visibleRows[i];
      for (let x = xMin; x <= xMax; x++) {
        collection.add(row[x]);
      }
    }
  }

  private _renderEntities(entitiesInView: Set<Entity>) {
    const toPrune = this._entitiesInScene.difference(entitiesInView);
    const newEntities = entitiesInView.difference(this._entitiesInScene);

    for (const e of toPrune) {
      this._entitiesInScene.delete(e);
      const renderable = this._renderables.get(e.id);
      if (renderable == null) {
        continue;
      }
      this._scene.remove(renderable.getMesh());
      this._entitiesInScene.delete(e);
    }

    for (const entity of newEntities) {
      // survive an undefined map tile
      if (entity == null) {
        continue;
      }
      let renderable = this._renderables.get(entity.id);
      if (renderable == null) {
        const C = this._getRenderableConstructorForType(entity.type);
        renderable = new C();
        renderable.id = entity.id;
        this._renderables.set(entity.id, renderable);
      }

      const pos = firstComponentByTypeOrThrow(entity, "position") as Position;

      renderable.setPosition([pos.values.x, pos.values.y]);
      renderable.setRotation(pos.values.rotation);

      this._entitiesInScene.add(entity);
      this._scene.add(renderable.getMesh());
    }

    // update entities positions
    for (const entity of entitiesInView) {
      if (entity == null) {
        continue;
      }
      const renderable = this._renderables.get(entity.id);
      if (renderable == null) {
        continue;
      }
      const pos = firstComponentByTypeOrThrow(entity, "position") as Position;
      renderable.setPosition([pos.values.x, pos.values.y]);
      renderable.setRotation(pos.values.rotation);
    }


  }

  private _getRenderableConstructorForType(
    type: string
  ): RenderableConstructor {
    const c = typeToRenderable[type];

    if (c == null) {
      throw new Error("Can't find a renderer for type " + type);
    }
    return c;
  }
}
