export interface DeviceMetricSeriesResponseMetaQuery {
  timeUnit: string;
  from: string;
  to: string;
  metrics: string[];
}

export interface DeviceMetricSeriesResponseMetricEntry {
  unit: string;
  values: (number | null)[];
}

export interface DeviceMetricSeriesResponse {
  meta: {
    deviceId: string;
    query: DeviceMetricSeriesResponseMetaQuery;
  };
  timestamps: string[];
  metrics: Record<string, DeviceMetricSeriesResponseMetricEntry>;
}

export interface DeviceLatestValueResponse {
  deviceId: string;
  metric: string;
  value: number | string | null;
  timestamp: string;
}

export interface DeviceLatestMultiMetricEntry {
  value: number | string | null;
  unit?: string;
  timestamp?: string;
}

export interface DeviceLatestMultiResponseMetaQuery {
  metrics: string[];
}

export interface DeviceLatestMultiResponseMeta {
  deviceId: string;
  query: DeviceLatestMultiResponseMetaQuery;
}

export interface DeviceLatestMultiResponseMetricEntryBase {
  unit: string;
  value: number | string | null;
}
export interface DeviceLatestMultiResponse {
  meta: DeviceLatestMultiResponseMeta;
  timestamp: string;
  metrics: Record<string, DeviceLatestMultiResponseMetricEntryBase>;
}

export type DeviceLatestNormalizedMap = Record<string, DeviceLatestMultiMetricEntry>;
