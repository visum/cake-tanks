import { Position } from "../components/position";
import { Entity, firstComponentByTypeOrThrow } from "../world";
import { System } from "./system";

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
  space: InputCommand.FIRE,
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

  process(): void {
    this._applyKeys();
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

  private _applyKeys() {
    for (const k of this._keysDown) {
      this._applyKey(k);
    }
  }

  private _applyKey(key: string) {
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
