import { api } from "@plug/api-hooks";
import {CreateStationData, Station} from '../types/facility'

const STATIONS_ENDPOINT = 'stations';


export const fetchStations = () => {
    return api.get<Station[]>('stations');
};

export const createStation = (data: CreateStationData): Promise<Response> => {
    return api.post(STATIONS_ENDPOINT, data);
};