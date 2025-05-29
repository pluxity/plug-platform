import { api } from "@plug/api-hooks";
import {CreateStationData, Station} from '../types/facility'

const STATIONS_ENDPOINT = 'stations';


export const fetchStations = () => {
    return api.get<Station[]>('stations');
};

export const createStation = (data: {
    facility: {
        code: string;
        description: string;
        drawingFileId: number | null;
        name: string;
        thumbnailFileId: number | null
    };
    floors: { floorId: string; name: string }[];
    lineId: number;
    route: string
}): Promise<Response> => {
    return api.post(STATIONS_ENDPOINT, data);
};