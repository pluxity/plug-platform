import { ReactNode } from "react";
import { FacilityType } from "../store/FacilityListStore";
import { FacilityData } from "@/backoffice/domains/facility/types/facilityData";
import { Floors } from "@plug/common-services";

export interface FacilityDefinition<T extends FacilityData = FacilityData> {
  type: FacilityType;
  displayName: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  getInitialData: () => T;
  createServiceHook: string;
  detailServiceHook: string;
  updateServiceHook: string;
  sections: SectionDefinition<T>[];
  is: (data: unknown) => data is T;
  getCardColor?: () => string;
  validateData?: (data: T) => string | null;
  showFloorInfo?: boolean;
}

export interface SectionDefinition<T extends FacilityData = FacilityData> {
  id: string;
  title: string;
  required: boolean;
  render: (props: SectionRenderProps<T>) => ReactNode;
}

export interface SectionRenderProps<T extends FacilityData = FacilityData> {
  data: T;
  onChange: (newData: T) => void;
  handlers: {
    onFloorsChange?: (floors: Floors[]) => void;
    onStationCodesChange?: (codes: string[]) => void;
    onLineIdsChange?: (lineIds: number[]) => void;
  };
  disabled?: boolean;
}

class FacilityRegistryImpl {
  private definitions = new Map<FacilityType, FacilityDefinition<FacilityData>>();

  register<T extends FacilityData>(definition: FacilityDefinition<T>): void {
    if (this.definitions.has(definition.type)) {
      console.warn(
        `시설 유형 "${definition.type}"이 이미 등록되어 있습니다. 덮어씁니다.`,
      );
    }

    this.definitions.set(
      definition.type,
      definition as unknown as FacilityDefinition<FacilityData>,
    );
  }

  get<T extends FacilityData = FacilityData>(type: FacilityType): FacilityDefinition<T> | undefined {
    return this.definitions.get(type) as FacilityDefinition<T> | undefined;
  }

  getAll(): Array<FacilityDefinition<FacilityData>> {
    return Array.from(this.definitions.values());
  }

  getByName(name: string): FacilityDefinition<FacilityData> | undefined {
    return this.getAll().find(def => def.type === name);
  }
}

export const FacilityRegistry = new FacilityRegistryImpl();