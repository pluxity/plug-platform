import { ReactNode } from "react";
import { FacilityType } from "../../store/FacilityListStore";
import { FacilityTypeGuard } from "../../types/facilityTypeGuard";
import { Floor, StationFacility } from "@plug/common-services";
import { StationInfoSection } from "@/backoffice/domains/facility/plugin/createFormSections/StationInfoSection";
import { FloorInfoSection } from "../createFormSections/FloorInfoSection";

export interface SectionRenderProps<T extends FacilityTypeGuard = FacilityTypeGuard> {
  data: T;
  onChange: (newData: T) => void;
  handlers: {
    onFloorsChange?: (floors: Floor[]) => void;
    onStationCodesChange?: (codes: string[]) => void;
    onLineIdsChange?: (lineIds: number[]) => void;
  };
  disabled?: boolean;
}

export interface SectionDefinition<T extends FacilityTypeGuard = FacilityTypeGuard> {
  id: string;
  render: (props: SectionRenderProps<T>) => ReactNode;
}

export interface FacilityDefinition<T extends FacilityTypeGuard = FacilityTypeGuard> {
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
    renderFunction: (data: FacilityTypeGuard, handlers: unknown) => ReactNode;
  }[];

  getInitialData: () => FacilityTypeGuard;
  serviceHookName: string;
}

export const facilityTypeConfigs: Record<FacilityType, FacilityTypeConfig> = {
  facilities: {
    sections: [],
    serviceHookName: "",
    getInitialData: function () {
      throw new Error("Function not implemented.");
    },
  },

  buildings: {
    sections: [
      {
        name: "floorInfo",
        renderFunction: (data: FacilityTypeGuard) => (
          <FloorInfoSection floors={data.floors} />
        ),
        title: "",
        required: false,
      },
    ],
    serviceHookName: "useCreateBuilding",
    getInitialData: function () {
      throw new Error("Function not implemented.");
    },
  },

  stations: {
    sections: [
      {
        name: "floorInfo",
        renderFunction: (data: FacilityTypeGuard) => (
          <FloorInfoSection floors={data.floors} />
        ),
        title: "",
        required: false,
      },
      {
        name: "stationInfo",
        renderFunction: (data: FacilityTypeGuard, handlers: DataHandlers) => {
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
        title: "",
        required: false,
      },
    ],
    getInitialData: () =>
      ({
        facility: {
          name: "",
          code: "",
          description: "",
        },
        floors: [],
        lineIds: [],
        stationCodes: [],
      }) as StationFacility,
    serviceHookName: "useCreateStation",
  },
};

class FacilityRegistryImpl {
  private definitions = new Map<FacilityType, FacilityDefinition<FacilityTypeGuard>>();

  register<T extends FacilityTypeGuard>(definition: FacilityDefinition<T>): void {
    if (this.definitions.has(definition.type)) {
      console.warn(
        `시설 유형 "${definition.type}"이 이미 등록되어 있습니다. 덮어씁니다.`,
      );
    }

    this.definitions.set(
      definition.type,
      definition as unknown as FacilityDefinition<FacilityTypeGuard>,
    );
  }

  get<T extends FacilityTypeGuard = FacilityTypeGuard>(type: FacilityType): FacilityDefinition<T> | undefined {
    return this.definitions.get(type) as FacilityDefinition<T> | undefined;
  }

  getAll(): Array<FacilityDefinition<FacilityTypeGuard>> {
    return Array.from(this.definitions.values());
  }

  getByName(name: string): FacilityDefinition<FacilityTypeGuard> | undefined {
    return this.getAll().find(def => def.type === name);
  }
}

export const FacilityRegistry = new FacilityRegistryImpl();