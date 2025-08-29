import { FeatureResponse } from "./feature";

export interface CctvUpdateRequest{
    name: string;
    url: string;
}

export interface CctvCreateRequest{
    id: string;
    name: string;
    url: string;
}

export interface CctvResponse{
    id: string;
    name: string;
    url: string;
    feature: FeatureResponse;
}