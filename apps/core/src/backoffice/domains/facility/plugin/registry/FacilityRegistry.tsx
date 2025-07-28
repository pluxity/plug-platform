import { ReactNode } from "react";
import { FacilityType } from "../../store/FacilityListStore";
import { FacilityData } from "../../types/facilityTypeGuard";
import { Floor, BuildingDtos, StationDtos } from "@plug/common-services";
import { StationInfoSection } from "@/backoffice/domains/facility/plugin/createFormSections/StationInfoSection";
import { FloorInfoSection } from "../createFormSections/FloorInfoSection";

export interface SectionRenderProps<T extends FacilityData = FacilityData> {
  data: T;
  onChange: (newData: T) => void;
  handlers: {
    onFloorsChange?: (floors: Floor[]) => void;
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
    getInitialData: function () {
      throw new Error("Function not implemented.");
    },
  },

  buildings: {
    sections: [
      {
        name: "floorInfo",
        renderFunction: (data: FacilityData) => {
          const buildingData = data as BuildingDtos['RESPONSE'];
          return <FloorInfoSection floors={buildingData.floors || []} />;
        },
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
        renderFunction: (data: FacilityData) => {
          const buildingData = data as BuildingDtos['RESPONSE'];
          return <FloorInfoSection floors={buildingData.floors || []} />;
        },
        title: "",
        required: false,
      },
      {
        name: "stationInfo",
        renderFunction: (data: FacilityData, handlers: DataHandlers) => {
          const stationData = data as StationDtos['RESPONSE'] ;
          return (
            <StationInfoSection
              stationCodes={stationData.stationInfo.stationCodes || []}
              lineIds={stationData.stationInfo.lineIds || []}
              onStationCodesChange={handlers.onStationCodesChange || (() => {})}
              onLineIdsChange={handlers.onLineIdsChange || (() => {})}
            />
          );
        },
        title: "",
        required: false,
      },
    ],
    getInitialData: () => ({
      facility: {
        id: 0,
        name: "",
        code: "",
        description: "",
        drawing: {
          id: null,
          url: null,
          originalFileName: null,
          contentType: null,
          fileStatus: null
        },
        thumbnail: {
          id: null,
          url: null,
          originalFileName: null,
          contentType: null,
          fileStatus: null
        },
        paths: [],
        lon: null,
        lat: null,
        locationMeta: null,
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        updatedBy: ""
      },
      floors: [],
      stationInfo: {
        lineIds: [],
        stationCodes: []
      }
    }) as unknown as StationDtos['RESPONSE'],
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