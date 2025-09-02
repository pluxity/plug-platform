import type { DeviceResponse } from '@plug/common-services'
import InfoDialog from './InfoDialog'
import { useState, useEffect, useMemo } from 'react'
import { useDeviceTimeSeriesSWR } from '@/global/services'
import DeviceMetricCharts from './DeviceMetricCharts'

export interface DeviceInfoDialogProps {
  device: DeviceResponse
  onClose?: () => void
  hole?: { x?: string; y?: string; w?: string; h?: string } | false
}

const DEFAULT_DEVICE_HOLE = { x: '1.25rem', y: '1.25rem', w: '28rem', h: '22rem' }

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

  const badges = (
    <>
      {device.deviceCategory?.name && (
        <span className="px-[0.625rem] py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm">
          {device.deviceCategory.name}
        </span>
      )}
    </>
  )

  const body = (
    <div className="flex flex-col gap-6 pr-2 flex-1 overflow-hidden">
      <div className="grid grid-cols-2 gap-4 text-sm text-slate-200">
        <div className="space-y-3">
          <div>
            <span className="text-slate-400 font-medium">장치 ID</span>
            <p className="text-slate-100 mt-1 font-mono">{device.id}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="ml-auto flex gap-1 text-xs">
            {(['day','week','month'] as const).map(periodOption => (
              <button
                key={periodOption}
                onClick={() => setSelectedPeriod(periodOption)}
                className={
                  'px-2 py-1 rounded border transition ' +
                  (selectedPeriod === periodOption
                    ? 'bg-indigo-500/30 border-indigo-400/40 text-indigo-200'
                    : 'bg-slate-700/40 border-slate-600/40 text-slate-300 hover:bg-slate-600/40')
                }
              >
                {periodOption === 'day' ? '일별' : periodOption === 'week' ? '주별' : '월별'}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-600/60 p-3 flex-1 overflow-hidden text-white bg-transparent">
          {isLoading && !deviceMetricSeries && (
            <div className="text-slate-400 text-sm">불러오는 중...</div>
          )}
          {!isLoading && !deviceMetricSeries && (
            <div className="text-slate-400 text-sm">데이터가 없습니다.</div>
          )}
          {deviceMetricSeries && (
            <DeviceMetricCharts series={deviceMetricSeries} />
          )}
        </div>
      </div>
    </div>
  )

  return (
    <InfoDialog
      open={!!device}
      title={device.name || '장치 정보'}
      onClose={onClose}
      badges={badges}
      bodyClassName="flex-1 overflow-hidden"
      dialogHeightClass="h-[36rem]"
      dialogWidthClass="w-[84rem]"
      hole={hole === undefined ? { ...DEFAULT_DEVICE_HOLE, w: '40rem', h: '30rem' } : (hole === false ? false : { ...DEFAULT_DEVICE_HOLE, ...hole })}
      className={hole === false ? 'w-[60rem] h-[40rem] max-w-[95vw]' : 'w-[88rem] h-[40rem] max-w-[96vw]'}
    >
      {body}
    </InfoDialog>
  )
}

export default DeviceInfoDialog
