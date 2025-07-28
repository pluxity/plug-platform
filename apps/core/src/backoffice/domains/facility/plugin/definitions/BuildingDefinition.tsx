import { FacilityDefinition } from "../registry/FacilityRegistry";
import { BuildingDtos } from "@plug/common-services";
import { isBuildingFacility } from "../../types/facilityTypeGuard";
import { Building } from "lucide-react";
import { FloorInfoSection } from "../createFormSections/FloorInfoSection";

export const BuildingDefinition: FacilityDefinition<BuildingDtos["CREATE_REQUEST"]> = {
  type: "buildings",
  displayName: "건물",
  description: "건물 시설을 관리합니다",
  icon: Building,
  getInitialData: () => ({
    facility: {
      id: 0,
      name: "",
      code: "",
      description: "",
      thumbnailFileId: 0,
      drawingFileId: 0,
    },
    floors: [],
  }),
  createServiceHook: "useCreate",
  detailServiceHook: "useDetail",
  updateServiceHook: "useUpdate",
  deleteServiceHook: "useDeletion",
  sections: [
    {
      id: "floorInfo",
      render: (props) => {
        const { data } = props;
        return (
          <FloorInfoSection floors={data.floors || []} />
        );
      },
    },
  ],
  is: isBuildingFacility,
  getCardColor: () => "#3498db",
  showFloorInfo: true,
};