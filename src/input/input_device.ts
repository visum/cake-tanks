export enum InputType {
  UP,
  DOWN,
  RIGHT,
  LEFT,
  FIRE,
}

export type InputEventHandler = (event: InputType) => void;

export interface InputDevice {
  start(): void;
  stop(): void;

  attach(handler:InputEventHandler): void;
  dispose():void;
}
