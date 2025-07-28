import { FacilityDefinition } from "../registry/FacilityRegistry";
import { StationDtos } from "@plug/common-services";
import { isStationFacility } from "../../types/facilityTypeGuard";
import { Train } from "lucide-react";
import { FloorInfoSection } from "../createFormSections/FloorInfoSection";
import { StationInfoSection } from "../createFormSections/StationInfoSection";

export const StationDefinition: FacilityDefinition<StationDtos['RESPONSE']> = {
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
      drawing: {
        id: 0,
        url: "",
        originalFileName: "",
        contentType: "",
        fileStatus: "",
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        updatedBy: "",
      },
      thumbnail: {
        id: 0,
        url: "",
        originalFileName: "",
        contentType: "",
        fileStatus: "",
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        updatedBy: "",
      },
      path: "",
      createdAt: "",
      createdBy: "",
      updatedAt: "",
      updatedBy: ""
    },
    floors: [],
    stationInfo: {
      lineIds: [],
      stationCodes: []
    }
  }),
  createServiceHook: "useCreateStation",
  detailServiceHook: "useDetailStation",
  updateServiceHook: "useUpdateStation",
  deleteServiceHook: "useDeleteStation",
  sections: [
    {
      id: "floorInfo",
      render: (props) => {
        const { data } = props;
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4">층 정보</h3>
            <FloorInfoSection floors={data.floors || []} />
          </div>
        );
      }
    },
    {
      id: "stationInfo",
      render: (props) => {
        const { data, handlers } = props;
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4">역사 정보</h3>
            <StationInfoSection
              stationCodes={data.stationInfo.stationCodes || []}
              lineIds={data.stationInfo.lineIds || []}
              onStationCodesChange={(value: number[]) =>
                handlers.onStationCodesChange(value)
              }
              onLineIdsChange={(value: number[]) =>
                handlers.onLineIdsChange(value)
              }
              disabled={props.disabled}
            />
          </div>
        );
      }
    }
  ],
  is: isStationFacility,
  getCardColor: () => "#e74c3c",
  showFloorInfo: true
};