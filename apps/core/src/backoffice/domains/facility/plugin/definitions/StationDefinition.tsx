import { FacilityDefinition } from "../registry/FacilityRegistry";
import { StationDtos } from "@plug/common-services";
import { isStationFacility } from "../../types/facilityTypeGuard";
import { Train } from "lucide-react";
import { FloorInfoSection } from "../createFormSections/FloorInfoSection";
import { StationInfoSection } from "../createFormSections/StationInfoSection";

export const StationDefinition: FacilityDefinition<StationDtos['CREATE_REQUEST']> = {
  type: "stations",
  displayName: "역사",
  description: "역사 시설을 관리합니다",
  icon: Train,
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
    stationInfo: {
      lineIds: [],
      stationCodes: []
    }
  }),
  createServiceHook: "useCreate",
  detailServiceHook: "useDetail",
  updateServiceHook: "useUpdate",
  deleteServiceHook: "useDelete",
  sections: [
    {
      id: "floorInfo",
      render: (props) => {
        const { data } = props;
        return (
            <FloorInfoSection floors={data.floors || []} />
        );
      }
    },
    {
      id: "stationInfo",
      render: (props) => {
        const { data } = props;
        return (
            <StationInfoSection
              stationCodes={data.stationInfo?.stationCodes || []}
              lineIds={data.stationInfo?.lineIds || []}
              onStationCodesChange={function (): void {
                throw new Error("Function not implemented.");
              }}
              onLineIdsChange={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
        );
      }
    }
  ],
  is: isStationFacility,
  getCardColor: () => "#e74c3c",
  showFloorInfo: true
};