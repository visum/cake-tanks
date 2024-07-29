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
};

export class ScreenRenderer implements System {
  private _scene: THREE.Scene;
  private _renderables = new Map<number, Renderable>();
  private _entitiesInScene = new Set<Entity>();

  constructor(scene: THREE.Scene) {
    this._scene = scene;
  }

  process(world: World): void {
    const entities = world.getEntitiesWithComponentTypes([
      "renderable",
      "position",
    ]);


    const viewport = world.getEntitiesByType('viewport')[0];
    const viewportRect = firstComponentByTypeOrThrow(viewport, "rect") as Rect;

    const entitiesInView = new Set<Entity>();
    const rectXMin = viewportRect.values.x;
    const rectXMax = viewportRect.values.x + viewportRect.values.width;
    const rectYMin = viewportRect.values.y;
    const rectYMax = viewportRect.values.y + viewportRect.values.height;

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const position = firstComponentByTypeOrThrow(entity, "position") as Position;
      if (position.values.x > rectXMin && position.values.x < rectXMax && position.values.y > rectYMin && position.values.y < rectYMax) {
        entitiesInView.add(entity);
      }
    }

    const toPrune = this._entitiesInScene.difference(entitiesInView);
    const newEntities = entitiesInView.difference(this._entitiesInScene);

    for (const e of toPrune) {
      this._entitiesInScene.delete(e);
      const renderable = this._renderables.get(e.id);
      this._scene.remove(renderable.getMesh());
    }

    for (const entity of newEntities) {
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
      const renderable = this._renderables.get(entity.id);
      const pos = firstComponentByTypeOrThrow(entity, "position") as Position;
      renderable.setPosition([pos.values.x, pos.values.y]);
      renderable.setRotation(pos.values.rotation);
    }

  }

  private _renderDynamicEntities() {

  }

  private _renderMapEntities() {

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
