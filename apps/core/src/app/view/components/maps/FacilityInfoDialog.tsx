import type { FacilityResponse } from '@plug/common-services'

export interface FacilityInfoDialogProps {
  facility: FacilityResponse | null
  onClose?: () => void
  /** 실내 보기 / 진입 액션 콜백 (없으면 버튼 숨김) */
  onEnterIndoor?: (facility: FacilityResponse) => void
}

// 고정 레이아웃 / 중앙 배치 / 투명도 ↑ 버전
const FacilityInfoDialog: React.FC<FacilityInfoDialogProps> = ({ facility, onClose, onEnterIndoor }) => {
  if (!facility) return null

  // 마스크(왼쪽 영상/미디어 영역 구멍) 사이즈/위치 정의
  // rem 단위 (1rem = 16px) 로 변환: 32px=2rem, 720px=45rem, 560px=35rem
  const hole = { x: '2rem', y: '2rem', w: '45rem', h: '35rem' }
  const maskStyle: React.CSSProperties = {
    WebkitMask: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
    mask: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude' as unknown as string,
    WebkitMaskRepeat: 'no-repeat, no-repeat',
    maskRepeat: 'no-repeat, no-repeat',
    WebkitMaskPosition: `0 0, ${hole.x} ${hole.y}`,
    maskPosition: `0 0, ${hole.x} ${hole.y}`,
    WebkitMaskSize: `100% 100%, ${hole.w} ${hole.h}`,
    maskSize: `100% 100%, ${hole.w} ${hole.h}`
  }

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-[70]">
      <div
  className="relative w-2/3 h-[38.75rem] rounded-2xl flex text-slate-100 
        bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-700/60 backdrop-blur-xs 
        border border-white/10 shadow-2xl"
        style={maskStyle}
      >
        <div className="shrink-0 w-[45.5rem] h-full" />
        <div className="flex flex-col flex-1 p-10 pl-14 gap-8 pointer-events-auto overflow-hidden relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-16 h-16 rounded-2xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-[0.95] transition"
            aria-label="닫기"
          >
            <span className="text-2xl font-light tracking-tight">✕</span>
          </button>
          <div className="flex items-start gap-5 pr-16">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-[2.75rem] leading-[1.05] font-semibold tracking-tight text-white drop-shadow">
                  {facility.name || '시설 정보'}
                </h2>
                {onEnterIndoor && (
                  <button
                    onClick={() => facility && onEnterIndoor(facility)}
                    className="mt-1 inline-flex items-center gap-1.5 px-[1rem] py-2 rounded-xl text-[0.75rem] font-semibold tracking-wide \
                    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 \
                    text-white shadow shadow-indigo-900/30 hover:shadow-pink-900/30 transition focus:outline-none focus:ring-2 focus:ring-pink-300/40"
                  >
                    <span>실내로 진입</span>
                  </button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">
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
              </div>
            </div>
          </div>
          {facility.description && (
            <p className="text-sm leading-relaxed text-slate-200/90">
              {facility.description}
            </p>
          )}
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
          <div className="mt-auto pt-4 flex items-center justify-end gap-4">
            {onEnterIndoor && (
              <button
                onClick={() => facility && onEnterIndoor(facility)}
                className="inline-flex items-center gap-2 px-[1.75rem] py-3 rounded-xl text-sm font-semibold tracking-wide \
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 \
                text-white shadow-lg shadow-indigo-900/40 hover:shadow-pink-900/40 transition focus:outline-none focus:ring-2 focus:ring-pink-300/50"
              >
                <span className="relative pr-1">실내로 진입하기</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacilityInfoDialog
