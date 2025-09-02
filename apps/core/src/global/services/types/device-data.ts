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
