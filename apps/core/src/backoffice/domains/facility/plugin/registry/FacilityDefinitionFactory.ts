import { FacilityDefinition, SectionDefinition, facilityTypeConfigs } from "./FacilityRegistry";
import { FacilityData } from "../../types/facilityData";
import { FacilityType } from "../../store/FacilityListStore";

export interface FacilityDefinitionOptions<T extends FacilityData> {
  type: FacilityType;
  displayName: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isTypeGuard: hasFloor | isStationFacility;
  getCardColor?: () => string;
  validateData?: (data: T) => string | null;
}

export function createFacilityDefinition<T extends FacilityData>(
  options: FacilityDefinitionOptions<T>
): FacilityDefinition<T> {
  const typeConfig = facilityTypeConfigs[options.type];

  if (!typeConfig) {
    throw new Error(`시설 유형 "${options.type}"에 대한 설정이 facilityTypeConfigs에 없습니다.`);
  }

  const sections: SectionDefinition<T>[] = typeConfig.sections.map(section => ({
    id: section.name,
    title: section.title,
    required: section.required,
    render: (props: any) => section.renderFunction(props.data, props.handlers)
  }));

  return {
    type: options.type,
    displayName: options.displayName,
    description: options.description,
    icon: options.icon,
    getInitialData: typeConfig.getInitialData as () => T,
    createServiceHook: typeConfig.serviceHookName,
    detailServiceHook: typeConfig.serviceHookName.replace('Create', 'Detail'),
    updateServiceHook: typeConfig.serviceHookName.replace('Create', 'Update'),
    deleteServiceHook: typeConfig.serviceHookName.replace('Create', 'Delete'),
    sections,
    is: options.isTypeGuard,
    getCardColor: options.getCardColor,
    validateData: options.validateData,
    showFloorInfo: true, // 또는 옵션에서 가져오기
  };
}