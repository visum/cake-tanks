import {Movement} from "../components/movement";
import {Position} from "../components/position";
import {System} from "./system.ts";
import {firstComponentByTypeOrThrow} from "../world.ts";

export class MovementSystem implements System {
  process (world: World) {
    const entities = world.getEntitiesWithComponentTypes(["movement", "position"]);

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const movementComponent = firstComponentByTypeOrThrow(entity, "movement") as Movement;
      const positionComponent = firstComponentByTypeOrThrow(entity, "position") as Position;
      const [dX, dY] = this._directionDistanceToDxDy(
        movementComponent.values.direction,
        movementComponent.values.speed,
      );

      positionComponent.values.x -= dX;
      positionComponent.values.y += dY;

    }
  }

private _directionDistanceToDxDy(direction: number, distance: number) {
    const dX = distance * Math.sin(direction);
    const dY = distance * Math.cos(direction);
    return [dX, dY];
  }

}
