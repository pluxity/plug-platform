import { FacilityDefinition, SectionDefinition } from "./FacilityRegistry";
import { FacilityData } from "../../types/facilityData";
import { FacilityType } from "../../store/FacilityListStore";

export interface FacilityDefinitionOptions<T extends FacilityData> {
  type: FacilityType;
  displayName: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  getInitialData: () => T;
  servicePrefix: string;
  sections: SectionDefinition<T>[];
  isTypeGuard: (data: unknown) => data is T;
  getCardColor?: () => string;
  validateData?: (data: T) => string | null;
  showFloorInfo?: boolean;
}

export function createFacilityDefinition<T extends FacilityData>(
  options: FacilityDefinitionOptions<T>
): FacilityDefinition<T> {
  return {
    type: options.type,
    displayName: options.displayName,
    description: options.description,
    icon: options.icon,
    getInitialData: options.getInitialData,
    createServiceHook: `${options.servicePrefix}Create`,
    detailServiceHook: `${options.servicePrefix}Detail`,
    updateServiceHook: `${options.servicePrefix}Update`,
    deleteServiceHook: `${options.servicePrefix}Delete`,
    sections: options.sections,
    is: options.isTypeGuard,
    getCardColor: options.getCardColor,
    validateData: options.validateData,
    showFloorInfo: options.showFloorInfo,
  };
}