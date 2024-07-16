import { Movement } from "../components/movement";
import { Position } from "../components/position";
import { firstComponentByTypeOrThrow, World } from "../world";
import { System } from "./system";

export class TankSystem implements System {
  process(world: World) {
    const tank = world.getEntitiesByType("tank")[0];
    const movementComponent = firstComponentByTypeOrThrow(
      tank,
      "movement"
    ) as Movement;
    const positionComponent = firstComponentByTypeOrThrow(
      tank,
      "position"
    ) as Position;

    if (movementComponent.values.speed !== 0) {
      const [dX, dY] = this._directionDistanceToDxDy(
        movementComponent.values.direction,
        movementComponent.values.speed
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
