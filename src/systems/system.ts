import { World } from "../world";
export interface System {
  process(world: World): void;
}
