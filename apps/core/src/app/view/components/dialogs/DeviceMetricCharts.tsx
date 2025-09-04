import type { DeviceMetricSeriesResponse } from '@/global/services/types/device-data';

import { Suspense, lazy, useMemo } from 'react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@plug/ui';

import { buildTimeSeriesLayout } from '@/global/services';
const Plot = lazy(() => import('react-plotly.js'));

export interface DeviceMetricChartsProps {
  series: DeviceMetricSeriesResponse;
  heightClass?: string;
  className?: string;
  hideModeBar?: boolean;
}

export const DeviceMetricCharts = ({
  series,
  heightClass = 'h-[14rem]',
  className,
  hideModeBar = false,
}: DeviceMetricChartsProps) => {
  const metricKeys = useMemo(() => Object.keys(series.metrics), [series]);
  if (!metricKeys.length) return <div className="text-slate-400 text-sm">메트릭이 없습니다.</div>;

  return (
    <div className={['flex flex-col text-white', heightClass, className || ''].join(' ')}>
      <Suspense fallback={<div className="text-slate-400 text-sm">차트 로딩...</div>}>
        <Tabs defaultValue={metricKeys[0]} className="flex flex-col flex-1 min-h-0">
          <TabsList
            unstyled
            className="w-full h-8 overflow-x-auto flex-nowrap flex gap-2 pb-1 border-b border-slate-600/50 text-white bg-transparent"
          >
            {metricKeys.map((metricName) => (
              <TabsTrigger
                key={metricName}
                value={metricName}
                unstyled
                className="flex-1 min-w-[6rem] px-3 py-1 text-xs font-medium rounded-md border border-slate-600/60 text-white/70 hover:text-white hover:border-slate-400/70 data-[state=active]:text-white data-[state=active]:border-slate-300 data-[state=active]:bg-slate-600/20 transition-colors"
              >
                {metricName}
              </TabsTrigger>
            ))}
          </TabsList>
          {metricKeys.map((metricName) => {
            const metricData = series.metrics[metricName];
            const rawUnit = metricData.unit || '';
            const unitSuffix = rawUnit ? ` (${rawUnit})` : '';
            const timestamps = series.timestamps;
            const maxTicks = 10;
            const step = timestamps.length > maxTicks ? Math.ceil(timestamps.length / maxTicks) : 1;
            const tickvals = timestamps.filter((_, i) => i % step === 0);
            return (
              <TabsContent key={metricName} value={metricName} className="mt-1 flex-1 min-h-0">
                <div className="flex flex-col w-full h-80 min-h-0">
                  <div className="text-[11px] text-white/80 mb-0.5 select-none leading-none">단위: {rawUnit || '-'}</div>
                  <div className="relative flex-1 min-h-0">
                    <Plot
                      data={[
                        {
                          type: 'scatter',
                          mode: 'lines+markers',
                          name: metricName + unitSuffix,
                          x: timestamps,
                          y: metricData.values,
                          connectgaps: true,
                          hovertemplate: rawUnit
                            ? '%{x}<br><b>%{y}</b> ' + rawUnit + '<extra></extra>'
                            : '%{x}<br><b>%{y}</b><extra></extra>'
                        }
                      ]}
                      layout={{
                        ...buildTimeSeriesLayout(`${metricName}${unitSuffix}`),
                        autosize: true,
                        dragmode: 'pan',
                        margin: { t: 12, r: 8, b: 32, l: 44 },
                        xaxis: {
                          title: 'Time',
                          tickangle: 0,
                          tickmode: 'array',
                          tickvals,
                          ticktext: tickvals
                        },
                        yaxis: { title: metricName, automargin: true }
                      }}
                      style={{ width: '100%', height: '100%' }}
                      config={hideModeBar
                        ? {
                            displaylogo: false,
                            responsive: true,
                            displayModeBar: false
                          }
                        : {
                            displaylogo: false,
                            responsive: true,
                            modeBarButtonsToRemove: [
                              'select2d',
                              'lasso2d',
                              'zoom2d',
                              'zoomIn2d',
                              'zoomOut2d',
                              'autoScale2d',
                              'hoverCompareCartesian',
                              'hoverClosestCartesian',
                              'toggleSpikelines'
                            ]
                          }
                      }
                    />
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </Suspense>
    </div>
  )
}

export default DeviceMetricCharts;