import type { FacilityResponse } from '@plug/common-services'
import InfoDialog from './InfoDialog'

export interface FacilityInfoDialogProps {
  facility: FacilityResponse | null
  onClose?: () => void
  onEnterIndoor?: (facility: FacilityResponse) => void
  hole?: { x?: string; y?: string; w?: string; h?: string } | false
}

const FacilityInfoDialog: React.FC<FacilityInfoDialogProps> = ({ facility, onClose, onEnterIndoor, hole }) => {
  if (!facility) return null

  const badges = (
    <>
      {facility.code && (
        <span className="px-[0.625rem] py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-sm">
          {facility.code}
        </span>
      )}
      {facility.type && (
        <span className="px-[0.625rem] py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm">
          {facility.type}
        </span>
      )}
    </>
  )

  const headerActions = onEnterIndoor && (
    <button
      onClick={() => facility && onEnterIndoor(facility)}
      className="mt-1 inline-flex items-center gap-1.5 px-[1rem] py-2 rounded-xl text-[0.75rem] font-semibold tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white shadow shadow-indigo-900/30 hover:shadow-pink-900/30 transition focus:outline-none focus:ring-2 focus:ring-pink-300/40"
    >
      <span>실내로 진입</span>
    </button>
  )

  const descriptionBlock = facility.description && (
    <p className="text-sm leading-relaxed text-slate-200/90">{facility.description}</p>
  )

  const grid = (
    <div className="grid grid-cols-3 gap-5 text-sm mt-2 text-slate-200">
      {facility.lat && facility.lon && (
        <div className="col-span-3 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] bg-white/5 px-[1rem] py-3 rounded-xl border border-white/10">
          <div className="font-semibold tracking-wide text-[11px] text-slate-400">위치</div>
          <div className="font-mono">Lat: {facility.lat.toFixed(6)}</div>
          <div className="font-mono">Lon: {facility.lon.toFixed(6)}</div>
        </div>
      )}
      {facility.createdAt && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
          <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">생성일</div>
          <div className="text-[13px] text-slate-100">{new Date(facility.createdAt).toLocaleDateString()}</div>
        </div>
      )}
      {facility.updatedAt && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
          <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">수정일</div>
          <div className="text-[13px] text-slate-100">{new Date(facility.updatedAt).toLocaleDateString()}</div>
        </div>
      )}
    </div>
  )

  const footer = onEnterIndoor && (
    <button
      onClick={() => facility && onEnterIndoor(facility)}
      className="inline-flex items-center gap-2 px-[1.75rem] py-3 rounded-xl text-sm font-semibold tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white shadow-lg shadow-indigo-900/40 hover:shadow-pink-900/40 transition focus:outline-none focus:ring-2 focus:ring-pink-300/50"
    >
      <span className="relative pr-1">실내로 진입하기</span>
    </button>
  )

  return (
    <InfoDialog
      open={!!facility}
      title={facility.name || '시설 정보'}
      onClose={onClose}
      hole={hole === undefined ? undefined : hole}
      headerActions={headerActions}
      badges={badges}
      footer={footer}
    >
      {descriptionBlock}
      {grid}
    </InfoDialog>
  )
}

export default FacilityInfoDialog
