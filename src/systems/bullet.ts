import { Age } from "../components/age";
import { Movement } from "../components/movement";
import { Position } from "../components/position";
import { World } from "../world";
import { System } from "./system";

export class BulletSystem implements System {
  process(world: World) {
    const bullets = world.getEntitiesByType("bullet");

    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];
      const positionComponent = bullet.components.find(
        (s) => s.type === "position"
      ) as Position;
      const movementComponent = bullet.components.find(
        (s) => s.type === "movement"
      ) as Movement;
      const ageComponent = bullet.components.find(
        (s) => s.type === "age"
      ) as Age;

      if (ageComponent.values.age >= 100) {
        world.remove(bullet);
        return;
      }

      const [dX, dY] = this._directionDistanceToDxDy(
        movementComponent.values.direction,
        movementComponent.values.speed
      );

      positionComponent.values.x -= dX;
      positionComponent.values.y += dY;

      ageComponent.values.age += 1;
    }
  }

  private _directionDistanceToDxDy(direction: number, distance: number) {
    const dX = distance * Math.sin(direction);
    const dY = distance * Math.cos(direction);
    return [dX, dY];
  }
}
