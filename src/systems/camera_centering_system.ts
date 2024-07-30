import { World, firstComponentByTypeOrThrow } from "../world.ts";
import { System } from "./system.ts";
import { Position } from "../components/position.ts";
import { Rect } from "../components/rect.ts";
import { OrthographicCamera } from "three";

export class CameraCenteringSystem implements System {

  private _thresholdX = 60;
  private _thresholdY = 50;

  private _camera: OrthographicCamera;

  constructor(camera: OrthographicCamera) {
    this._camera = camera;
  }

  process(world: World) {
    const tank = world.getEntitiesByType('tank')[0];
    const viewport = world.getEntitiesByType('viewport')[0];

    const tankPosition = firstComponentByTypeOrThrow(tank, 'position') as Position;
    const viewportRect = firstComponentByTypeOrThrow(viewport, 'rect') as Rect;

    const viewportCenterX = viewportRect.values.width / 2 + viewportRect.values.x;
    const viewportCenterY = viewportRect.values.height / 2 + viewportRect.values.y;

    const xMin = viewportCenterX - this._thresholdX;
    const xMax = viewportCenterX + this._thresholdX;
    const yMin = viewportCenterY - this._thresholdY;
    const yMax = viewportCenterY + this._thresholdY;

    if (tankPosition.values.x < xMin) {
      viewportRect.values.x -= xMin - tankPosition.values.x;
    }
    if (tankPosition.values.x > xMax) {
      viewportRect.values.x += tankPosition.values.x - xMax;
    }

    if (tankPosition.values.y < yMin) {
      viewportRect.values.y -= yMin - tankPosition.values.y;
    }

    if (tankPosition.values.y > yMax) {
      viewportRect.values.y += tankPosition.values.y - yMax;
    }

    this._camera.left = viewportRect.values.x;
    this._camera.right = viewportRect.values.x + viewportRect.values.width;
    this._camera.bottom = viewportRect.values.y;
    this._camera.top = viewportRect.values.y + viewportRect.values.height;
    this._camera.updateProjectionMatrix();

  }
}

