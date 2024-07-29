import {System} from "../systems/system.ts";
import {Age} from "../components/age.ts";
import {firstComponentByTypeOrThrow} from "../world.ts";

export class AgeSystem implements System {
  process(world: World) {
    const entities = world.getEntitiesWithComponentTypes(["age"]);
    for(let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const ageComponent = firstComponentByTypeOrThrow(entity, "age") as Age;
      ageComponent.values.age += 1;
      if(ageComponent.values.expireAt != null && ageComponent.values.age >= ageComponent.values.expireAt) {
        world.remove(entity);
      }
    }
  }
}
