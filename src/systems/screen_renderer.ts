import { World, firstComponentByTypeOrThrow } from "../world";
import { System } from "./system";
import { Tank } from "../things/tank";
import { Bullet } from "../things/bullet";
import { Renderable } from "../things/renderable";
import * as THREE from "three";
import { Position } from "../components/position";

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
};

export class ScreenRenderer implements System {
  private _scene: THREE.Scene;
  private _renderables = new Map<number, Renderable>();
  private _renderablesInScene = new Set<Renderable>();

  constructor(scene: THREE.Scene) {
    this._scene = scene;
  }

  process(world: World): void {
    const renderables = world.getEntitiesWithComponentTypes([
      "renderable",
      "position",
    ]);
    // prune renderables not in scene
    const toPrune = Array.from(this._renderablesInScene).filter(
      (r) => !renderables.some((e) => e.id === r.id)
    );

    toPrune.forEach((p) => {
      this._renderablesInScene.delete(p);
      this._scene.remove(p.getMesh());
    });

    for (let i = 0; i < renderables.length; i++) {
      const entity = renderables[i];
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

      if (!this._renderablesInScene.has(renderable)) {
        this._renderablesInScene.add(renderable);
        this._scene.add(renderable.getMesh());
      }
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
