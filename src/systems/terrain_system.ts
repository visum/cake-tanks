import { Movement } from "../components/movement";
import { Position } from "../components/position";
import { World, firstComponentByTypeOrThrow } from "../world";
import { System } from "./system";

const terrainTypeToDragFactor: Record<string, number> = {
  "tree": 0.5,
  grass: 0.7,
  water: 0.3,
};

export class TerrainSystem implements System {
  process(world: World) {
    const terrainables = world.getEntitiesWithComponentTypes(['terrain']);

    for (let i = 0; i < terrainables.length; i++) {
      const positionComponent = firstComponentByTypeOrThrow(terrainables[i], 'position') as Position;
      try {
        const tile = world.getMapTileForCoords(positionComponent.values.x, positionComponent.values.y);
        const movementComponent = firstComponentByTypeOrThrow(terrainables[i], 'movement') as Movement;
        movementComponent.values.drag = terrainTypeToDragFactor[tile.type] ?? 1;
      } catch {
        continue;
      }
    }
  }
}
