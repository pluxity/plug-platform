import type { DeviceResponse } from '@plug/common-services'
import InfoDialog from './InfoDialog'
import { useState, useEffect, useMemo } from 'react'
import { useDeviceTimeSeriesSWR, useDeviceLatestNormalizedSWR, normalizeLatest } from '@/global/services'
import DeviceMetricCharts from './DeviceMetricCharts'

export interface DeviceInfoDialogProps {
  device: DeviceResponse
  onClose?: () => void
  hole?: { x?: string; y?: string; w?: string; h?: string } | false
}

// const DEFAULT_DEVICE_HOLE = { x: '1.25rem', y: '1.25rem', w: '28rem', h: '22rem' }

const DeviceInfoDialog = ({ device, onClose, hole }: DeviceInfoDialogProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day')

  useEffect(() => {
    setSelectedPeriod('day')
  }, [device?.id])

  const { from, to, interval } = useMemo(() => {
    const PERIOD_PRESETS: Record<'day' | 'week' | 'month', { days: number; interval: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' }> = {
      day: { days: 30, interval: 'DAY' },     // 기본: 최근 30일 일별
      week: { days: 84, interval: 'WEEK' },   // 최근 12주 주별
      month: { days: 365, interval: 'MONTH' } // 최근 12개월 월별
    }
    const preset = PERIOD_PRESETS[selectedPeriod]
    const end = new Date()
    end.setMinutes(0, 0, 0)
    const toDate = end.toISOString()
    const fromDate = new Date(end.getTime() - preset.days * 24 * 60 * 60 * 1000).toISOString()
    return { from: fromDate, to: toDate, interval: preset.interval }
  }, [selectedPeriod])

  const timeSeriesParams = { from, to, interval }
  const { data: deviceMetricSeries, isLoading } = useDeviceTimeSeriesSWR(device.companyType, device.deviceType, device.id, timeSeriesParams)
  const { data: latestRaw, isLoading: isLatestLoading } = useDeviceLatestNormalizedSWR(device.companyType, device.deviceType, device.id)
  const latestMap = useMemo(() => normalizeLatest(latestRaw), [latestRaw])

  const formatKoreanDateTime = (ts?: string) => {
    if (!ts) return ''
    const d = new Date(ts)
    if (isNaN(d.getTime())) return ts
    const fmt = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(d)
    return fmt
      .replace(/\s*오전\s*/g, ' ')
      .replace(/\s*오후\s*/, ' ')
      .replace(/\.\s/g, '.')
      .replace(/\.$/, '')
  }

  const firstTimestamp = useMemo(() => {
    const first = Object.values(latestMap)[0]
    return first?.timestamp
  }, [latestMap])

  const badges = (
    <>
      {device.deviceCategory?.name && (
        <span className="px-[0.625rem] py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm">
          {device.deviceCategory.name}
        </span>
      )}
      {device.id && (
        <span className="px-2 py-1 rounded-full bg-slate-600/40 text-slate-200 border border-slate-500/40 font-mono text-[11px] max-w-[14rem] truncate" title={device.id}>
          {device.id}
        </span>
      )}
    </>
  )

  const body = (
    <div className="flex flex-col gap-5 flex-1 overflow-hidden">
      {/* Latest Metrics Section */}
  <section className="rounded-lg border border-slate-600/60 bg-gradient-to-br from-slate-800/70 to-slate-800/40 backdrop-blur-sm p-4">
        <div className="flex items-start gap-3 mb-3">
          <h4 className="text-sm font-semibold text-slate-100 tracking-wide">현재값</h4>
          <div className="ml-auto text-[11px] text-slate-400 flex items-center gap-1">
            {firstTimestamp && (
              <>
                <span className="text-slate-500">측정시각</span>
                <span className="font-medium text-slate-300">{formatKoreanDateTime(firstTimestamp)}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {isLatestLoading && !Object.keys(latestMap).length && (
            <div className="text-slate-400 text-xs">불러오는 중...</div>
          )}
          {!isLatestLoading && !Object.keys(latestMap).length && (
            <div className="text-slate-500 text-xs">현재값 없음</div>
          )}
          {Object.entries(latestMap).map(([k, v]) => (
            <div
              key={k}
              className="group relative px-3 py-2 rounded-md bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/60 transition-colors min-w-[6.5rem]"
            >
              <div className="text-[11px] uppercase tracking-wide text-slate-400 group-hover:text-slate-300 transition-colors">{k}</div>
              <div className="text-base font-semibold text-slate-100 flex items-baseline gap-1">
                {v.value ?? '-'}
                {v.unit && <span className="text-[11px] font-normal text-slate-400">{v.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chart Section */}
      <section className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-100 tracking-wide">추이 차트</h4>
          <div className="ml-auto flex gap-1 text-xs">
            {(['day','week','month'] as const).map(periodOption => (
              <button
                key={periodOption}
                onClick={() => setSelectedPeriod(periodOption)}
                className={
                  'px-2 py-1 rounded border transition shadow-sm ' +
                  (selectedPeriod === periodOption
                    ? 'bg-indigo-500/30 border-indigo-400/40 text-indigo-200 ring-1 ring-indigo-400/30'
                    : 'bg-slate-700/40 border-slate-600/40 text-slate-300 hover:bg-slate-600/50 hover:text-slate-200')
                }
              >
                {periodOption === 'day' ? '일별' : periodOption === 'week' ? '주별' : '월별'}
              </button>
            ))}
          </div>
        </div>
    <div className="rounded-lg border border-slate-600/60 p-3 flex-1 overflow-hidden text-white bg-slate-800/40 backdrop-blur-sm min-h-0 flex flex-col">
          {isLoading && !deviceMetricSeries && (
            <div className="text-slate-400 text-sm">불러오는 중...</div>
          )}
          {!isLoading && !deviceMetricSeries && (
            <div className="text-slate-500 text-sm">데이터가 없습니다.</div>
          )}
          {deviceMetricSeries && (
      <DeviceMetricCharts series={deviceMetricSeries} heightClass="h-full" className="flex-1 min-h-0" />
          )}
        </div>
      </section>
    </div>
  )

  return (
    <InfoDialog
      open={!!device}
      title={device.name || '장치 정보'}
      onClose={onClose}
      badges={badges}
      titleClassName="text-2xl font-semibold tracking-tight text-white"
      bodyClassName="flex-1 overflow-hidden"
      // hole={hole === undefined ? { ...DEFAULT_DEVICE_HOLE, w: '40rem', h: '30rem' } : (hole === false ? false : { ...DEFAULT_DEVICE_HOLE, ...hole })}
      hole={hole}
      dialogWidthClass={"w-[48rem]"}
      className={"h-[40rem]"}
    >
      {body}
    </InfoDialog>
  )
}

export default DeviceInfoDialog
