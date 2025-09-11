import DeviceMetricCharts from './DeviceMetricCharts';

import { useState, useEffect, useMemo, useRef } from 'react';

import type { DeviceResponse } from '@plug/common-services';

import { DEVICE_PERIOD_PRESETS } from '@/global/constants/device';
import { useDeviceTimeSeriesSWR, useDeviceLatestNormalizedSWR, normalizeLatest } from '@/global/services';
import { formatKoreanDateTime } from '@/global/utils/date';

import InfoDialog from './InfoDialog';
export interface DeviceInfoDialogProps {
  device: DeviceResponse;
  onClose?: () => void;
  hole?: { x?: string; y?: string; w?: string; h?: string } | false;
}

// const DEFAULT_DEVICE_HOLE = { x: '1.25rem', y: '1.25rem', w: '28rem', h: '22rem' }

const DeviceInfoDialog = ({ device, onClose, hole }: DeviceInfoDialogProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    setSelectedPeriod('day');
  }, [device?.id]);

  const { from, to, interval } = useMemo(() => {
    const preset = DEVICE_PERIOD_PRESETS[selectedPeriod];
    const end = new Date();
    end.setMinutes(0, 0, 0);
    const toDate = end.toISOString();
    const fromDate = new Date(end.getTime() - preset.days * 24 * 60 * 60 * 1000).toISOString();
    return { from: fromDate, to: toDate, interval: preset.interval };
  }, [selectedPeriod]);

  const timeSeriesParams = useMemo(() => ({ from, to, interval }), [from, to, interval]);
  const { data: deviceMetricSeries, isLoading } = useDeviceTimeSeriesSWR(device.companyType, device.deviceType, device.id, timeSeriesParams);
  // Refresh interval adjusted to 1 minute (from previous 6 seconds)
  const { data: latestRaw, isLoading: isLatestLoading } = useDeviceLatestNormalizedSWR(
    device.companyType,
    device.deviceType,
    device.id,
    { refreshInterval: 60000 }
  );
  const lastSeriesRef = useRef<typeof deviceMetricSeries | null>(null);
  if (deviceMetricSeries) lastSeriesRef.current = deviceMetricSeries;
  const effectiveSeries = deviceMetricSeries || lastSeriesRef.current;
  const latestMap = useMemo(() => normalizeLatest(latestRaw), [latestRaw]);


  const firstTimestamp = useMemo(() => {
    const first = Object.values(latestMap)[0];
    return first?.timestamp;
  }, [latestMap]);

  const badges = (
    <>
      {device.deviceCategory?.name && (
        <span className="px-[0.625rem] py-1 rounded-full bg-accent-500/20 text-accent-200 border border-accent-400/30 backdrop-blur-sm">
          {device.deviceCategory.name}
        </span>
      )}
      {device.id && (
        <span className="px-[0.625rem] py-1 rounded-full bg-primary-500/20 text-primary-200 border border-primary-400/30 backdrop-blur-sm" title={device.id}>
          {device.id}
        </span>
      )}
    </>
  );

  const body = (
    <div className="flex flex-col gap-5 flex-1 overflow-hidden">
      <section className="rounded-lg bg-secondary-100/10 px-4 py-3 rounded-xl border border-secondary-100/10 p-4">
        <div className="flex items-start gap-3 mb-3">
          <h4 className="text-sm font-semibold text-secondary-100 tracking-wide">현재값</h4>
          <div className="ml-auto text-[11px] text-secondary-400 flex items-center gap-1">
            {firstTimestamp && (
              <>
                <span className="text-secondary-400">측정시각</span>
                <span className="font-medium text-secondary-300/70">{formatKoreanDateTime(firstTimestamp)}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {isLatestLoading && !Object.keys(latestMap).length && (
            <div className="text-secondary-400 text-xs">불러오는 중...</div>
          )}
          {!isLatestLoading && !Object.keys(latestMap).length && (
            <div className="text-secondary-500 text-xs">현재값 없음</div>
          )}
          {Object.entries(latestMap).map(([k, v]) => (
            <div
              key={k}
              className="group relative px-3 py-2 rounded-md bg-secondary-1000/30 border border-secondary-1000/20 hover:border-secondary-700/30 transition-colors min-w-[6.5rem]"
            >
              <div className="text-[11px] uppercase tracking-wide text-secondary-400/80 group-hover:text-secondary-300 transition-colors">{k}</div>
              <div className="text-base font-semibold text-secondary-100 flex items-baseline gap-1">
                {v.value ?? '-'}
                {v.unit && <span className="text-[11px] font-normal text-secondary-400/80">{v.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chart Section */}
      <section className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-secondary-100 tracking-wide">추이 차트</h4>
          <div className="ml-auto flex gap-1 text-xs">
            {(['day','week','month'] as const).map(periodOption => (
              <button
                key={periodOption}
                onClick={() => setSelectedPeriod(periodOption)}
                className={
                  'px-2 py-1 rounded border transition shadow-sm ' +
                  (selectedPeriod === periodOption
                    ? 'bg-primary-700/20 border border-primary-400/30 text-primary-300'
                    : 'bg-secondary-900/30 border border-secondary-900/40 text-secondary-400/80 hover:border-secondary-700/30 hover:text-secondary-300')
                }
              >
                {periodOption === 'day' ? '일별' : periodOption === 'week' ? '주별' : '월별'}
              </button>
            ))}
          </div>
        </div>
    <div className="rounded-lg border border-secondary-1000/20 p-3 flex-1 overflow-hidden text-secondary-100 bg-secondary-900/30 min-h-0 flex flex-col">
      {isLoading && !effectiveSeries && (
            <div className="text-secondary-400 text-sm">불러오는 중...</div>
          )}
      {!isLoading && !effectiveSeries && (
            <div className="text-secondary-500 text-sm">데이터가 없습니다.</div>
          )}
      {effectiveSeries && (
            <DeviceMetricCharts
        series={effectiveSeries}
              // 차트 세로 높이 축소 (full -> 18rem) 으로 전체 Dialog 높이 감소
              heightClass="h-[18rem]"
              className="flex-1 min-h-0"
            />
          )}
        </div>
      </section>
    </div>
  );

  return (
    <InfoDialog
      open={!!device}
      title={device.name || '장치 정보'}
      onClose={onClose}
      badges={badges}
      titleClassName="text-2xl font-semibold tracking-tight text-secondary-100"
      bodyClassName="flex-1 overflow-hidden"
      // hole={hole === undefined ? { ...DEFAULT_DEVICE_HOLE, w: '40rem', h: '30rem' } : (hole === false ? false : { ...DEFAULT_DEVICE_HOLE, ...hole })}
      hole={hole}
      dialogWidthClass={"w-[48rem]"}
      className={"h-[24rem]"}
    >
      {body}
    </InfoDialog>
  );
};

export default DeviceInfoDialog;
