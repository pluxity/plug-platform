import { FacilityDefinition } from "../registry/FacilityRegistry";
import { StationDtos } from "@plug/common-services";
import { isStationFacility } from "../../types/facilityTypeGuard";
import { Train } from "lucide-react";
import { FloorInfoSection } from "@/backoffice/domains/facility/components/form/formOptions/FloorInfoSection";
import { StationInfoSection } from "@/backoffice/domains/facility/components/form/formOptions/StationInfoSection";

export const StationDefinition: FacilityDefinition<StationDtos['CREATE_REQUEST']> = {
  type: "stations",
  displayName: "역사",
  description: "역사 시설을 관리합니다",
  icon: Train,
  getInitialData: () => ({
    facility: {
      name: "",
      code: "",
      description: "",
      thumbnailFileId: 0,
      drawingFileId: 0,
      lon: 0,
      lat: 0,
      locationMeta: ""
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
        const { data, handlers } = props;
        return (
            <StationInfoSection
              stationInfo={{
                stationCodes: data.stationInfo?.stationCodes,
                lineIds: data.stationInfo?.lineIds,
              }}
              onStationCodesChange={handlers.onStationCodesChange}
              onLineIdsChange={handlers.onLineIdsChange}

            />
        );
      }
    }
  ],
  is: isStationFacility,
  getCardColor: () => "#e74c3c",
  showFloorInfo: true
};