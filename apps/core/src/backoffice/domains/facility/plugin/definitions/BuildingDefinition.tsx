import { createFacilityDefinition } from "../registry/FacilityDefinitionFactory";
import { Building } from "lucide-react";
import { FacilityRegistry } from "../registry/FacilityRegistry";
import { hasFloors } from "../../types/facilityData";

const BuildingDefinition = createFacilityDefinition({
  type: "buildings",
  displayName: "건물",
  description: "건물 시설물 관리",
  icon: Building,
  isTypeGuard: hasFloors,
  getCardColor: () => "#4B5563",
});

FacilityRegistry.register(BuildingDefinition);