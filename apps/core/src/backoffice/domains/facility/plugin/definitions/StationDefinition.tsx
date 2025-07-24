import { FacilityDefinition, FacilityRegistry } from '../registry/FacilityRegistry';
import { StationFacility } from "@plug/common-services";
import { FloorInfoSection } from "@/backoffice/domains/facility/plugin/createFormSections/FloorInfoSection";
import { StationInfoSection } from "@/backoffice/domains/facility/plugin/createFormSections/StationInfoSection";
import { TrainFront } from "lucide-react";

export const StationDefinition: FacilityDefinition<StationFacility> = {
  type: 'stations',
  displayName: '역사',
  description: '역사 관리',
  icon: () => <TrainFront/>,
  showFloorInfo: true,

  getInitialData: () => ({
    facility: {
      name: "",
      code: "",
      description: "",
    },
    floors: [],
    lineIds: [],
    stationCodes: []
  }),

  createServiceHook: 'useCreateStation',
  detailServiceHook: 'useStationDetail',
  updateServiceHook: 'useUpdateStation',
  deleteServiceHook: 'useDeleteStation',

  sections: [
    {
      id: 'floorInfo',
      title: '층 정보',
      required: true,
      render: ({ data}) => (
        <FloorInfoSection floors={data.floors} />
      )
    },
    {
      id: 'stationInfo',
      title: '역사 정보',
      required: true,
      render: ({ data, onChange }) => (
        <StationInfoSection
          stationCodes={data.stationCodes || []}
          lineIds={data.lineIds || []}
          onStationCodesChange={(stationCodes) => {
            onChange({ ...data, stationCodes });
          }}
          onLineIdsChange={(lineIds) => {
            onChange({ ...data, lineIds })
          }}
        />
      )
    }
  ],

  is: (data: unknown): data is StationFacility => {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return (
      'facility' in obj &&
      'floors' in obj &&
      'lineIds' in obj &&
      Array.isArray(obj.floors) &&
      Array.isArray(obj.lineIds)
    );
  },

  getCardColor: () => 'bg-emerald-500',

  validateData: (data) => {
    if (!data.facility.name) return '역사 이름을 입력해주세요';
    if (!data.facility.code) return '역사 코드를 입력해주세요';
    if (!data.lineIds.length) return '호선 정보를 선택해주세요';
    return null;
  }
};

FacilityRegistry.register(StationDefinition);