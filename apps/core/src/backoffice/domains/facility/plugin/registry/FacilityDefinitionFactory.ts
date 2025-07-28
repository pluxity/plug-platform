
import { FacilityType } from "../../store/FacilityListStore";
import {
  FacilityDefinition,
  facilityTypeConfigs, SectionDefinition
} from "@/backoffice/domains/facility/plugin/registry/FacilityRegistry";
import { FacilityData } from "@/backoffice/domains/facility/types/facilityTypeGuard";

export interface FacilityDefinitionOptions<T extends FacilityData> {
  type: FacilityType;
  displayName: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isTypeGuard: (data: unknown) => data is T;
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
    render: (props: { data: T; handlers: unknown }) => section.renderFunction(props.data, props.handlers)
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
    showFloorInfo: true,
  };
}