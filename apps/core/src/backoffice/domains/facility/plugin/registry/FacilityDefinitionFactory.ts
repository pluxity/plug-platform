import { BuildingDefinition } from "../definitions/BuildingDefinition";
import { StationDefinition } from "../definitions/StationDefinition";
import { FacilityRegistry } from "./FacilityRegistry";

FacilityRegistry.register(BuildingDefinition);
FacilityRegistry.register(StationDefinition);

export const initializeFacilityDefinitions = () => {
  console.log('시설 정의가 등록되었습니다.');
};