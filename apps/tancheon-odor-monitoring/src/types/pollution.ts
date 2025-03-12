
export interface PollutionPoint {
  longitude: number;
  latitude: number;
  value: number;
  height?: number;
}
export interface HeightHeatmaps {
  '30m': PollutionPoint[];
  '60m': PollutionPoint[];
  '90m': PollutionPoint[];
  [height: string]: PollutionPoint[];
}
export interface VisibleHeatmaps {
  '30m': boolean;
  '60m': boolean;
  '90m': boolean;
  [height: string]: boolean;
} 