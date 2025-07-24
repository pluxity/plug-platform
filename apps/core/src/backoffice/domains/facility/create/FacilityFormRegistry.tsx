import { FacilityType } from "../store/FacilityListStore";
import { ReactNode } from "react";
import { FloorInfoSection } from "@/backoffice/domains/facility/create/FloorInfoSection";
import { StationInfoSection } from "@/backoffice/domains/facility/create/StationInfoSection";
import { FacilityWithFloors, StationFacility } from "@plug/common-services";

export type FacilityData = FacilityWithFloors | StationFacility;

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
    getInitialData: () => ({
      facility: {
        name: "",
        code: "",
        description: "",
      },
      floors: [],
    }),
    serviceHookName: "",
  },

  buildings: {
    sections: [
      {
        name: "floorInfo",
        title: "층 정보",
        required: true,
        renderFunction: (data: FacilityData) => (
          <FloorInfoSection floors={data.floors} />
        ),
      },
    ],
    getInitialData: () => ({
      facility: {
        name: "",
        code: "",
        description: "",
      },
      floors: [],
    }),
    serviceHookName: "useCreateBuilding",
  },

  stations: {
    sections: [
      {
        name: "floorInfo",
        title: "층 정보",
        required: true,
        renderFunction: (data: FacilityData) => (
          <FloorInfoSection floors={data.floors} />
        ),
      },
      {
        name: "stationInfo",
        title: "역사 정보",
        required: true,
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