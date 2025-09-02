import { api, useSWRApi } from '@plug/api-hooks';
import { DeviceLatestValueResponse, DeviceMetricSeriesResponse } from './types/device-data';

const buildDeviceBase = (companyType: string, deviceType: string, deviceId: string) =>
  `devices/${encodeURIComponent(companyType)}/${encodeURIComponent(deviceType)}/${encodeURIComponent(deviceId)}`;

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
  deviceId?: string
) => {
  const isReady = Boolean(companyType && deviceType && deviceId);
  const url = isReady && companyType && deviceType && deviceId
    ? `${buildDeviceBase(companyType, deviceType, deviceId)}/latest`
    : '';
  return useSWRApi<DeviceLatestValueResponse>(url, 'GET', { requireAuth: true }, {
    refreshInterval: 5000,
    isPaused: () => !isReady,
  });
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
