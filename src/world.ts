const MAP_TILE_SIZE = 32;

export interface Component {
  type: string;
  values: unknown;
}

export type Entity = {
  type: string;
  id: number;
  components: Component[];
};

export function componentsByType(entity: Entity, type: string) {
  const result = [];
  for (let i = 0; i < entity.components.length; i++) {
    const component = entity.components[i];
    if (component.type === type) {
      result.push(component);
    }
  }
  return result;
}

export function firstComponentByTypeOrThrow(entity: Entity, type: string) {
  let match;
  for (let i = 0; i < entity.components.length && match == null; i++) {
    const c = entity.components[i];
    if (c.type === type) {
      match = c;
    }
  }
  if (match == null) {
    throw new Error(`The entity does not nave a ${type} component`);
  }
  return match;
}

export function componentsByQuery(
  entity: Entity,
  predicate: (c: Component) => boolean
) {
  return entity.components.filter(predicate);
}

export class World {
  private _entities: Entity[] = [];
  private _counter = 0;
  private _map: Entity[][] = [];

  get entities() {
    return this._entities;
  }

  get map() {
    return this._map;
  }

  set map(map: Entity[][]) {
    this._map = map;
  }

  getMapTileAt(x: number, y: number) {
    return this._map[y][x];
  }

  getNewEntity(type: string): Entity {
    const id = this._counter++;
    return {
      type,
      id,
      components: [],
    };
  }

  add(entity: Entity) {
    this._entities.push(entity);
  }

  remove(entity: Entity) {
    const index = this._entities.indexOf(entity);
    if (index > -1) {
      this._entities.splice(index, 1);
    } else {
      throw new Error("The provided entity is not in the world: " + entity);
    }
  }

  getEntitiesByType(type: string) {
    const result = [];
    for (let i = 0; i < this._entities.length; i++) {
      const entity = this._entities[i];
      if (entity.type === type) {
        result.push(entity);
      }
    }
    return result;
  }

  getEntitiesWithComponentTypes(types: string[]) {
    const result = [];
    entityLoop: for (let i = 0; i < this._entities.length; i++) {
      const entity = this._entities[i];
      for (let j = 0; j < types.length; j++) {
        const type = types[j];
        try {
          firstComponentByTypeOrThrow(entity, type);
        } catch {
          continue entityLoop;
        }
      }
      result.push(entity);
    }

    return result;
  }

  query(predicate: (e: Entity) => boolean) {
    return this._entities.filter(predicate);
  }

  getMapTileForCoords(x: number, y: number) {
    const mapX = Math.round(x / MAP_TILE_SIZE);
    const mapY = Math.round(y / MAP_TILE_SIZE);
    // console.log(mapX, mapY);
    return this.getMapTileAt(mapX, mapY);
  }
}
