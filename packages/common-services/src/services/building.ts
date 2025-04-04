import { useGet } from '@plug/api-hooks'; // 또는 useSWRApi
import type { Building } from '../types/building';

export const useBuildings = () => {
    return useGet<Building[]>('/buildings');
}

export const useBuildingDetail = (buildingId: number) => {
    return useGet<Building>(`/buildings/${buildingId}`)
}