import { Mesh } from "three";

export interface Renderable {
  id: number;
  setId(id:number): void;
  getMesh(): Mesh;
  setPosition(position: [number, number]): void;
  setRotation(rad: number): void;
}
