import { ReactNode } from "react";
import { FacilityType } from "../../store/FacilityListStore";
import { FacilityCreateRequest } from "../../types/facilityTypeGuard";
import { Floors } from "@plug/common-services";

export interface SectionRenderProps<T extends FacilityCreateRequest = FacilityCreateRequest> {
  data: T;
  onChange: (newData: T) => void;
  handlers: {
    onFloorsChange?: (floors: Floor[]) => void;
    onStationCodesChange?: (codes: string[]) => void;
    onLineIdsChange?: (lineIds: number[]) => void;
  };
  disabled?: boolean;
}

export interface SectionDefinition<T extends FacilityCreateRequest = FacilityCreateRequest> {
  id: string;
  render: (props: SectionRenderProps<T>) => ReactNode;
}

export interface FacilityDefinition<T extends FacilityCreateRequest = FacilityCreateRequest> {
  type: FacilityType;
  displayName: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  getInitialData: () => T;
  createServiceHook: string;
  detailServiceHook: string;
  updateServiceHook: string;
  deleteServiceHook: string;
  sections: SectionDefinition<T>[];
  is: (data: unknown) => data is T;
  getCardColor?: () => string;
  validateData?: (data: T) => string | null;
  showFloorInfo?: boolean;
}

export interface DataHandlers {
  onStationCodesChange?: (codes: string[]) => void;
  onLineIdsChange?: (lineIds: number[]) => void;
}

export interface FacilityTypeConfig {
  sections: {
    name: string;
    title: string;
    required: boolean;
    renderFunction: (data: FacilityCreateRequest, handlers: DataHandlers) => ReactNode;
  }[];

  getInitialData: () => FacilityCreateRequest;
  serviceHookName: string;
}

class FacilityRegistryImpl {
  private definitions = new Map<
    FacilityType,
    FacilityDefinition<FacilityCreateRequest>
  >();

  register<T extends FacilityCreateRequest>(
    definition: FacilityDefinition<T>,
  ): void {
    if (this.definitions.has(definition.type)) {
      console.warn(
        `시설 유형 "${definition.type}"이 이미 등록되어 있습니다. 덮어씁니다.`,
      );
    }

    this.definitions.set(
      definition.type,
      definition as unknown as FacilityDefinition<FacilityCreateRequest>,
    );
  }

  get<T extends FacilityCreateRequest = FacilityCreateRequest>(
    type: string,
  ): FacilityDefinition<T> | undefined {
    return this.definitions.get(type) as FacilityDefinition<T> | undefined;
  }

  getAll(): Array<FacilityDefinition<FacilityCreateRequest>> {
    return Array.from(this.definitions.values());
  }

  getByName(
    name: string,
  ): FacilityDefinition<FacilityCreateRequest> | undefined {
    return this.getAll().find((def) => def.type === name);
  }
}

export const FacilityRegistry = new FacilityRegistryImpl();