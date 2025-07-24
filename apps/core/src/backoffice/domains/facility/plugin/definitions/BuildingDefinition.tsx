import { FacilityDefinition, FacilityRegistry } from '../registry/FacilityRegistry';
import { FacilityWithFloors } from "@plug/common-services";
import { FloorInfoSection } from "@/backoffice/domains/facility/plugin/createFormSections/FloorInfoSection";
import { Building } from "lucide-react";

export const BuildingDefinition: FacilityDefinition<FacilityWithFloors> = {
  type: 'buildings',
  displayName: '건물',
  description: '건물 관리',
  icon: () => <Building/>,
  showFloorInfo: true,

  getInitialData: () => ({
    facility: {
      name: "",
      code: "",
      description: "",
    },
    floors: []
  }),

  createServiceHook: 'useCreateBuilding',
  detailServiceHook: 'useBuildingDetail',
  updateServiceHook: 'useUpdateBuilding',

  sections: [
    {
      id: 'floorInfo',
      title: '층 정보',
      required: true,
      render: ({ data }) => (
        <FloorInfoSection floors={data.floors} />
      )
    }
  ],

  is: (data: unknown): data is FacilityWithFloors => {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return (
      'facility' in obj &&
      'floors' in obj &&
      !('lineIds' in obj) &&
      Array.isArray(obj.floors)
    );
  },

  getCardColor: () => 'bg-blue-500',

  validateData: (data) => {
    if (!data.facility.name) return '건물 이름을 입력해주세요';
    if (!data.facility.code) return '건물 코드를 입력해주세요';
    return null;
  }
};

FacilityRegistry.register(BuildingDefinition);