import { InputDevice, InputEventHandler, InputType } from "./input_device";

const keyToEventType: Record<string, InputType> = {
  w: InputType.UP,
  a: InputType.LEFT,
  s: InputType.DOWN,
  d: InputType.RIGHT,
  Space: InputType.FIRE,
};

const REPEAT_DELAY = 15;

export class KeyboardInput implements InputDevice {
  private _enabled = false;
  private _handler: InputEventHandler | null = null;
  private _target: HTMLElement;
  private _repeatInterval: number = -1;
  private _keysDown = new Set<string>();

  constructor(targetElement?: HTMLElement) {
    this._target = targetElement || window.document.body;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._watchKeyboard();
  }

  start() {
    this._enabled = true;
  }

  stop() {
    this._enabled = false;
  }

  attach(handler: InputEventHandler) {
    this._handler = handler;
  }

  dispose(): void {
    this._target.removeEventListener("keypress", this._onKeyDown);
    window.clearInterval(this._repeatInterval);
  }

  private _dispatch() {
    if (!this._enabled) {
      return;
    }
    const handler = this._handler;
    if (!handler) {
      return;
    }
    Array.from(this._keysDown).forEach((key) => {
      const eventType = keyToEventType[key];
      if (eventType != null) {
        handler(eventType);
      }
    });
  }

  private _watchKeyboard() {
    this._target.addEventListener("keydown", this._onKeyDown);
    this._target.addEventListener("keyup", this._onKeyUp);
    this._repeatInterval = window.setInterval(
      () => this._dispatch(),
      REPEAT_DELAY
    );
  }

  private _onKeyDown(event: KeyboardEvent) {
    this._keysDown.add(event.key);
  }

  private _onKeyUp(event: KeyboardEvent) {
    this._keysDown.delete(event.key);
  }
}
