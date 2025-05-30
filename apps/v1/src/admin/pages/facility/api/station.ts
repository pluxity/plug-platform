import { api } from "@plug/api-hooks";
import {Station, StationDetail} from '../types/facility'

const STATIONS_ENDPOINT = 'stations';


export const fetchStations = () => {
    return api.get<Station[]>('stations');
};

export const fetchStationDetail = (id: number) => {
    return api.get<StationDetail>(`stations/${id}`);
}

export const patchStation = (id: number) => {
    return api.patch(`stations/${id}`);
}

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