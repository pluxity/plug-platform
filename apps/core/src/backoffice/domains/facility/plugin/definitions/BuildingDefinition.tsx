import { createFacilityDefinition } from "../registry/FacilityDefinitionFactory";
import { Building } from "lucide-react";
import { FacilityRegistry } from "../registry/FacilityRegistry";
import { isBuildingFacility } from "../../types/facilityTypeGuard";

const BuildingDefinition = createFacilityDefinition({
  type: "buildings",
  displayName: "건물",
  description: "건물 시설물 관리",
  icon: Building,
  isTypeGuard: isBuildingFacility,
  getCardColor: () => "#4B5563",
});

FacilityRegistry.register(BuildingDefinition);