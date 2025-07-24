import { FacilityType } from "../store/FacilityListStore";
import { ReactNode } from "react";
import { FloorInfoSection } from "@/backoffice/domains/facility/create/FloorInfoSection";
import { StationInfoSection } from "@/backoffice/domains/facility/create/StationInfoSection";
import { BuildingCreateRequest, StationCreateRequest, Floors } from "@plug/common-services";

export type FacilityData =
  | BuildingCreateRequest
  | StationCreateRequest;

export interface DataHandlers {
  onFloorsChange?: (floors: Floors[]) => void;
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
          // 타입 가드를 통해 StationCreateRequest 타입인지 확인
          const isStation = 'stationCodes' in data && 'lineIds' in data;

          return (
            <StationInfoSection
              stationCodes={isStation ? data.stationCodes || [] : []}
              lineIds={isStation ? data.lineIds || [] : []}
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
    } as StationCreateRequest),
    serviceHookName: "useCreateStation",
  },
};