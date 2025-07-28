import { FacilityDefinition } from "../registry/FacilityRegistry";
import { BuildingDtos } from "@plug/common-services";
import { isBuildingFacility } from "../../types/facilityTypeGuard";
import { Building } from "lucide-react";
import { FloorInfoSection } from "../createFormSections/FloorInfoSection";

export const BuildingDefinition: FacilityDefinition<BuildingDtos["RESPONSE"]> = {
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
      updatedBy: "",
    },
    floors: [],
  }),
  createServiceHook: "useCreateBuilding",
  detailServiceHook: "useDetailBuilding",
  updateServiceHook: "useUpdateBuilding",
  deleteServiceHook: "useDeleteBuilding",
  sections: [
    {
      id: "floorInfo",
      render: (props) => {
        const { data} = props;
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4">층 정보</h3>
            <FloorInfoSection
              floors={data.floors || []}
            />
          </div>
        );
      },
    },
  ],
  is: isBuildingFacility,
  getCardColor: () => "#3498db",
  showFloorInfo: true,
};