import { Position } from "../components/position";
import { Entity, firstComponentByTypeOrThrow, World } from "../world";
import { System } from "./system";
import { Movement } from "../components/movement";
import { Renderable } from "../components/renderable";
import { Age } from "../components/age";

/*
Watches the keyboard and moves an entity
*/

enum InputCommand {
  FORWARD,
  BACK,
  TURN_RIGHT,
  TURN_LEFT,
  FIRE,
}

const defaultInputMap: Record<string, InputCommand> = {
  w: InputCommand.FORWARD,
  a: InputCommand.TURN_LEFT,
  d: InputCommand.TURN_RIGHT,
  s: InputCommand.BACK,
  " ": InputCommand.FIRE,
};

export class KeyabordInput implements System {
  private _keysDown = new Set<string>();
  private _target: HTMLElement;
  private _positionComponent: Position;
  private _inputMap = defaultInputMap;

  constructor(targetElement: HTMLElement, targetEntity: Entity) {
    this._target = targetElement;
    this._positionComponent = firstComponentByTypeOrThrow(
      targetEntity,
      "position"
    ) as Position;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._watchKeyboard();
  }

  process(world: World): void {
    this._applyKeys(world);
  }

  private _watchKeyboard() {
    this._target.addEventListener("keydown", this._onKeyDown);
    this._target.addEventListener("keyup", this._onKeyUp);
  }

  private _onKeyDown(event: KeyboardEvent) {
    this._keysDown.add(event.key);
  }

  private _onKeyUp(event: KeyboardEvent) {
    this._keysDown.delete(event.key);
  }

  private _applyKeys(world: World) {
    for (const k of this._keysDown) {
      this._applyKey(k, world);
    }
  }

  private _applyKey(key: string, world: World) {
    const mapped = this._inputMap[key];
    if (mapped == null) {
      return;
    }
    const position = this._positionComponent;
    switch (mapped) {
      case InputCommand.FORWARD:
        {
          const [dX, dY] = this._directionDistanceToDxDy(
            position.values.rotation,
            1
          );
          position.values.x -= dX;
          position.values.y += dY;
        }
        break;
      case InputCommand.BACK:
        {
          const [dX, dY] = this._directionDistanceToDxDy(
            position.values.rotation,
            -1
          );
          position.values.x -= dX;
          position.values.y += dY;
        }
        break;
      case InputCommand.TURN_LEFT:
        position.values.rotation += 0.1;
        break;
      case InputCommand.TURN_RIGHT:
        position.values.rotation -= 0.1;
        break;
      case InputCommand.FIRE:
        this._keysDown.delete(" ");
        const bullet = world.getNewEntity("bullet");
        const movement: Movement = {
          type: "movement",
          values: {
            direction: position.values.rotation,
            speed: 1,
          },
        };
        const renderable: Renderable = {
          type: "renderable",
          values: undefined,
        };
        const age: Age = {
          type: "age",
          values: { age: 0 },
        };
        const bulletPosition: Position = {
          type: "position",
          values: {
            rotation: position.values.rotation,
            x: position.values.x,
            y: position.values.y,
          },
        };
        bullet.components.push(movement);
        bullet.components.push(renderable);
        bullet.components.push(age);
        bullet.components.push(bulletPosition);
        world.add(bullet);
        break;
      default:
        return;
    }
  }

  private _directionDistanceToDxDy(direction: number, distance: number) {
    const dX = distance * Math.sin(direction);
    const dY = distance * Math.cos(direction);
    return [dX, dY];
  }
}
