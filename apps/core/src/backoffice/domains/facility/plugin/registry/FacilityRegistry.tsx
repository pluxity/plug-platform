import { ReactNode } from "react";
import { FacilityType } from "../../store/FacilityListStore";
import { FacilityData } from "../../types/facilityData";
import { Floors, StationFacility } from "@plug/common-services";
import { StationInfoSection } from "@/backoffice/domains/facility/plugin/createFormSections/StationInfoSection";
import { FloorInfoSection } from "../createFormSections/FloorInfoSection";

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

export interface SectionDefinition<T extends FacilityData = FacilityData> {
  id: string;
  render: (props: SectionRenderProps<T>) => ReactNode;
}

export interface FacilityDefinition<T extends FacilityData = FacilityData> {
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
    renderFunction: (data: FacilityData, handlers: DataHandlers) => ReactNode;
  }[];

  getInitialData: () => FacilityData;
  serviceHookName: string;
}

export const facilityTypeConfigs: Record<FacilityType, FacilityTypeConfig> = {
  facilities: {
    sections: [],
    serviceHookName: "",
  },

  buildings: {
    sections: [
      {
        name: "floorInfo",
        renderFunction: (data: FacilityData) => (
          <FloorInfoSection floors={data.floors} />
        ),
      },
    ],
    serviceHookName: "useCreateBuilding",
  },

  stations: {
    sections: [
      {
        name: "floorInfo",
        renderFunction: (data: FacilityData) => (
          <FloorInfoSection floors={data.floors} />
        ),
      },
      {
        name: "stationInfo",
        renderFunction: (data: FacilityData, handlers: DataHandlers) => {
          const stationData = data as StationFacility;
          return (
            <StationInfoSection
              stationCodes={stationData.stationCodes || []}
              lineIds={stationData.lineIds || []}
              onStationCodesChange={handlers.onStationCodesChange || (() => {})}
              onLineIdsChange={handlers.onLineIdsChange || (() => {})}
            />
          );
        },
      },
    ],
    getInitialData: () => ({
      facility: {
        name: "",
        code: "",
        description: "",
      },
      floors: [],
      lineIds: [],
      stationCodes: [],
    } as StationFacility),
    serviceHookName: "useCreateStation",
  },
};

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