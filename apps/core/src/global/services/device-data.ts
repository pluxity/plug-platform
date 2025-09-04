import { api, useSWRApi } from '@plug/api-hooks';

import {
  DeviceLatestValueResponse,
  DeviceMetricSeriesResponse,
  DeviceLatestMultiResponse,
  DeviceLatestNormalizedMap,
  DeviceLatestMultiMetricEntry
} from './types/device-data';

const buildDeviceBase = (companyType: string, deviceType: string, deviceId: string) =>
  `devices/${encodeURIComponent(companyType)}/${encodeURIComponent(deviceType)}/${encodeURIComponent(deviceId)}`;

const formatDateParam = (value: string) => {
  if (/^\d{14}$/.test(value)) return value;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
};

export interface TimeSeriesParams {
  from: string;
  to: string;
  interval: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
}

export const getDeviceTimeSeries = async (
  companyType: string,
  deviceType: string,
  deviceId: string,
  params: TimeSeriesParams
): Promise<DeviceMetricSeriesResponse | null> => {
  const queryInit: Record<string, string> = {
    from: formatDateParam(params.from),
    to: formatDateParam(params.to),
    ...(params.interval ? { interval: params.interval } : {})
  };
  const query = new URLSearchParams(queryInit).toString();
  try {
    const url = `${buildDeviceBase(companyType, deviceType, deviceId)}/time-series?${query}`;
    const resp = await api.get<DeviceMetricSeriesResponse>(url, { requireAuth: true });
    const maybeData = (resp as unknown as { data?: DeviceMetricSeriesResponse }).data;
    return maybeData ?? (resp as unknown as DeviceMetricSeriesResponse);
  } catch {
    return null;
  }
};

export const useDeviceTimeSeriesSWR = (
  companyType?: string,
  deviceType?: string,
  deviceId?: string,
  params?: TimeSeriesParams
) => {
  const isReady = Boolean(companyType && deviceType && deviceId && params);
  const query = isReady && params
    ? new URLSearchParams({
      from: formatDateParam(params.from),
      to: formatDateParam(params.to),
      ...(params.interval ? { interval: params.interval } : {})
    }).toString()
    : '';
  const url = isReady && companyType && deviceType && deviceId
    ? `${buildDeviceBase(companyType, deviceType, deviceId)}/time-series?${query}`
    : '';
  return useSWRApi<DeviceMetricSeriesResponse>(url, 'GET', { requireAuth: true }, { isPaused: () => !isReady });
};

export const getDeviceLatest = async (
  companyType: string,
  deviceType: string,
  deviceId: string
): Promise<DeviceLatestValueResponse | null> => {
  try {
    const url = `${buildDeviceBase(companyType, deviceType, deviceId)}/latest`;
    const resp = await api.get<DeviceLatestValueResponse>(url, { requireAuth: true });
    const maybeData = (resp as unknown as { data?: DeviceLatestValueResponse }).data;
    return maybeData ?? (resp as unknown as DeviceLatestValueResponse);
  } catch {
    return null;
  }
};

export const useDeviceLatestSWR = (
  companyType?: string,
  deviceType?: string,
  deviceId?: string,
  options?: { refreshInterval?: number }
) => {
  const isReady = Boolean(companyType && deviceType && deviceId);
  const url = isReady && companyType && deviceType && deviceId
    ? `${buildDeviceBase(companyType, deviceType, deviceId)}/latest`
    : '';
  return useSWRApi<DeviceLatestValueResponse>(url, 'GET', { requireAuth: true }, {
    refreshInterval: options?.refreshInterval ?? 60000,
    isPaused: () => !isReady,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
};

const isMultiLatest = (data: unknown): data is DeviceLatestMultiResponse => {
  if (!data || typeof data !== 'object') return false;
  const maybe = data as { metrics?: unknown; meta?: unknown; timestamp?: unknown; metric?: unknown };
  return !!maybe.metrics && !!maybe.meta && !!maybe.timestamp && typeof maybe.metrics === 'object' && !('metric' in maybe);
};

const isSingleLatest = (data: unknown): data is DeviceLatestValueResponse => {
  if (!data || typeof data !== 'object') return false;
  return 'metric' in data && 'value' in data && 'timestamp' in data;
};

export const normalizeLatest = (
  data: DeviceLatestValueResponse | DeviceLatestMultiResponse | unknown | null
): DeviceLatestNormalizedMap => {
  if (!data) return {};
  if (isMultiLatest(data)) {
    const ts = data.timestamp;
    const out: DeviceLatestNormalizedMap = {};
    Object.entries(data.metrics).forEach(([k, v]) => {
      const entry = v as { value: number | string | null; unit?: string };
      out[k] = { value: entry.value, unit: entry.unit, timestamp: ts };
    });
    return out;
  }
  if (isSingleLatest(data)) {
    const entry: DeviceLatestMultiMetricEntry = {
      value: data.value,
      timestamp: data.timestamp
    };
    return { [data.metric]: entry };
  }
  return {};
};

export const getDeviceLatestNormalized = async (
  companyType: string,
  deviceType: string,
  deviceId: string
): Promise<DeviceLatestNormalizedMap> => {
  try {
    const url = `${buildDeviceBase(companyType, deviceType, deviceId)}/latest`;
  const resp = await api.get<unknown>(url, { requireAuth: true });
  const raw = (resp as { data?: unknown })?.data ?? resp;
  return normalizeLatest(raw);
  } catch {
    return {};
  }
};

export const useDeviceLatestNormalizedSWR = (
  companyType?: string,
  deviceType?: string,
  deviceId?: string,
  options?: { refreshInterval?: number }
) => {
  const isReady = Boolean(companyType && deviceType && deviceId);
  const url = isReady && companyType && deviceType && deviceId
    ? `${buildDeviceBase(companyType, deviceType, deviceId)}/latest`
    : '';
  return useSWRApi<DeviceLatestMultiResponse | DeviceLatestValueResponse>(
    url,
    'GET',
    { requireAuth: true },
    {
    refreshInterval: options?.refreshInterval ?? 60000,
      isPaused: () => !isReady,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
};

interface PlotlyTrace {
  type: 'scatter';
  mode: string;
  name: string;
  x: string[];
  y: (number | null)[];
  connectgaps?: boolean;
}
export const buildPlotlyTraces = (series: DeviceMetricSeriesResponse): PlotlyTrace[] => {
  if (!series || !Array.isArray(series.timestamps)) return [];
  return Object.entries(series.metrics || {}).map(([metricName, entry]) => ({
    type: 'scatter',
    mode: 'lines+markers',
    name: metricName + (entry.unit ? ` (${entry.unit})` : ''),
    x: series.timestamps,
    y: entry.values,
    connectgaps: true,
  }));
};

export const buildTimeSeriesLayout = (title: string) => ({
  title,
  font: { color: '#ffffff' },
  xaxis: { title: 'Time', tickfont: { color: '#ffffff' }, titlefont: { color: '#ffffff' } },
  yaxis: { title: 'Value', automargin: true, tickfont: { color: '#ffffff' }, titlefont: { color: '#ffffff' } },
  legend: { orientation: 'h', y: -0.2, font: { color: '#ffffff' } },
  margin: { t: 40, r: 20, b: 60, l: 50 },
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)'
});
