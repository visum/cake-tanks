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
  return entity.components.filter((c) => c.type === type);
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

  get entities() {
    return this._entities;
  }

  getNewEntity(type: string):Entity {
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
    return this._entities.filter((e) => e.type === type);
  }

  getEntitiesWithComponentTypes(types: string[]) {
    return this._entities.filter((e) =>
      types.every((t) => componentsByType(e, t).length > 0)
    );
  }

  query(predicate: (e: Entity) => boolean) {
    return this._entities.filter(predicate);
  }
}
