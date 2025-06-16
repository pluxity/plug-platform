// NFlux Platform Widget API 서비스
import { createNfluxWidgetApiClient } from '../clients/nflux';
import type {
  LightGroup,
  ShutterGroup,
  WidgetApiResponse
} from '../types/nflux';

export const nfluxWidgetService = {
  // 조명 제어반(그룹) 조회
  getLightGroups: async (stationId: string): Promise<LightGroup[]> => {
    const client = createNfluxWidgetApiClient(undefined);
    const response = await client.get(`lightGroups/${stationId}`).json<WidgetApiResponse<LightGroup>>();
    return response.lightGroups || [];
  },

  // 셔터 제어반(그룹) 조회
  getShutterGroups: async (stationId: string): Promise<ShutterGroup[]> => {
    const client = createNfluxWidgetApiClient(undefined);
    const response = await client.get(`shutterGroups/${stationId}`).json<WidgetApiResponse<ShutterGroup>>();
    return response.shutterGroups || [];
  }
};
