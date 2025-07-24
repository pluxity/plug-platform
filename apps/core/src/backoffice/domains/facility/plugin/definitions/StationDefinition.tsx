import { createFacilityDefinition } from "../registry/FacilityDefinitionFactory";
import { TrainFront } from "lucide-react";
import { FacilityRegistry } from "../registry/FacilityRegistry";
import { hasFloors, isStationFacility } from "../../types/facilityData";
import { StationFacility } from "@plug/common-services";

const StationDefinition = createFacilityDefinition({
  type: "stations",
  displayName: "역사",
  description: "역사 시설물 관리",
  icon: TrainFront,
  isTypeGuard: (data: StationFacility): data is StationFacility =>
    hasFloors(data) && isStationFacility(data),
  getCardColor: () => "#1E40AF",
});

FacilityRegistry.register(StationDefinition);