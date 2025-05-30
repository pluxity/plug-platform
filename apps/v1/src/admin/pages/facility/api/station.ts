import { api } from "@plug/api-hooks";
import {Station, StationDetail} from '../types/facility'

const STATIONS_ENDPOINT = 'stations';

export const fetchStations = () => {
    return api.get<Station[]>(STATIONS_ENDPOINT);
};

export const fetchStationDetail = (id: number) => {
    return api.get<StationDetail>(`${STATIONS_ENDPOINT}/${id}`);
}

export const patchStation = (data: {
    id: number;
    facility: {
        name: string;
        description: string;
        code: string;
    };
    lineIds: number[];
    floors: Array<{ name: string; floorId: number }>;
    externalCode: string;
}) => {
    return api.patch(`${STATIONS_ENDPOINT}/${data.id}`, data);
};

export const createStation = (data: {
    facility: {
        code: string;
        description: string;
        drawingFileId: number | null;
        name: string;
        thumbnailFileId: number | null
    };
    floors: { floorId: number; name: string }[];
    lineIds: number[];
    route: string;
    externalCode: string;
}): Promise<Response> => {
    return api.post(STATIONS_ENDPOINT, data);
};