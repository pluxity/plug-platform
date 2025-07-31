import { BuildingDefinition } from "../definitions/BuildingDefinition";
import { StationDefinition } from "../definitions/StationDefinition";
import { FacilityRegistry } from "./FacilityRegistry";

FacilityRegistry.register(BuildingDefinition);
FacilityRegistry.register(StationDefinition);

export const initializeFacilityDefinitions = () => {
  FacilityRegistry.register(BuildingDefinition);
  FacilityRegistry.register(StationDefinition);
};
