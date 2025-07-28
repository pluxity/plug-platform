import { createFacilityDefinition } from "../registry/FacilityDefinitionFactory";
import { TrainFront } from "lucide-react";
import { FacilityRegistry } from "../registry/FacilityRegistry";
import { isStationFacility } from "../../types/facilityTypeGuard";

const StationDefinition = createFacilityDefinition({
  type: "stations",
  displayName: "역사",
  description: "역사 시설물 관리",
  icon: TrainFront,
  isTypeGuard: isStationFacility,
  getCardColor: () => "#1E40AF",
});

FacilityRegistry.register(StationDefinition);