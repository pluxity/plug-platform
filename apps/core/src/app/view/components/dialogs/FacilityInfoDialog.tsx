import InfoDialog from './InfoDialog';

import type { FacilityResponse } from '@plug/common-services';
export interface FacilityInfoDialogProps {
  facility: FacilityResponse | null;
  onClose?: () => void;
  onEnterIndoor?: (facility: FacilityResponse) => void;
  hole?: { x?: string; y?: string; w?: string; h?: string } | false;
}

const FacilityInfoDialog = ({ facility, onClose, onEnterIndoor, hole }: FacilityInfoDialogProps) => {
  if (!facility) return null;

  const badges = (
    <>
      {facility.code && (
        <span className="px-[0.625rem] py-1 rounded-full bg-primary-500/20 text-primary-200 border border-primary-400/30 backdrop-blur-sm">
          {facility.code}
        </span>
      )}
      {facility.type && (
        <span className="px-[0.625rem] py-1 rounded-full bg-accent-500/20 text-accent-200 border border-accent-400/30 backdrop-blur-sm">
          {facility.type}
        </span>
      )}
    </>
  );

  const headerActions = onEnterIndoor && (
    <button
      onClick={() => onEnterIndoor(facility)}
      className="mt-1 inline-flex items-center gap-1.5 px-[1rem] py-2 rounded-xl text-[0.75rem] font-semibold tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white shadow shadow-indigo-900/30 hover:shadow-pink-900/30 transition focus:outline-none focus:ring-2 focus:ring-pink-300/40"
    >
      <span>실내로 진입</span>
    </button>
  );

  // 위치 블록 (맨 위)
  const locationBlock = (facility.lat && facility.lon) ? (
    <div className="flex items-center flex-wrap gap-x-6 text-[0.8125rem] bg-secondary-100/10 px-4 py-3 rounded-xl border border-secondary-100/10">
      <div className="font-semibold tracking-wide text-[11px] text-secondary-400">위치</div>
      <div className="font-mono">Lat: {facility.lat.toFixed(6)}</div>
      <div className="font-mono">Lon: {facility.lon.toFixed(6)}</div>
    </div>
  ) : null;

  // 상세 설명 블록 (헤더 포함)
  const descriptionBlock = facility.description ? (
    <div className="flex flex-col gap-2">
      <h5 className="text-xs font-semibold tracking-wide text-secondary-400">상세 설명</h5>
      <p className="text-sm leading-relaxed text-secondary-200 whitespace-pre-wrap break-words">{facility.description}</p>
    </div>
  ) : null

  // Footer 로 이동한 생성/수정일 메타 정보
  const metaDates = (facility.createdAt || facility.updatedAt) ? (
    <div className="flex flex-wrap gap-4 text-[10px] text-secondary-300/70 leading-tight">
      {facility.createdAt && (
        <div className="flex flex-col min-w-[6rem]">
          <span className="uppercase tracking-wide text-secondary-400 mb-0.5">생성일</span>
          <span className="text-[11px]">{new Date(facility.createdAt).toLocaleDateString()}</span>
        </div>
      )}
      {facility.updatedAt && (
        <div className="flex flex-col min-w-[6rem]">
          <span className="uppercase tracking-wide text-secondary-400 mb-0.5">수정일</span>
          <span className="text-[11px]">{new Date(facility.updatedAt).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  ) : null;

  const indoorBtn = onEnterIndoor ? (
    <button
      onClick={() => facility && onEnterIndoor(facility)}
      className="inline-flex items-center gap-2 px-[1.25rem] py-2.5 rounded-xl text-[13px] font-semibold tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white shadow-lg shadow-indigo-900/40 hover:shadow-pink-900/40 transition focus:outline-none focus:ring-2 focus:ring-pink-300/50"
    >
      <span className="relative pr-1">실내로 진입하기</span>
    </button>
  ) : null;

  const footer = (indoorBtn || metaDates) ? (
    <div className="w-full flex flex-wrap items-start justify-between gap-6">
      {indoorBtn}
      <div className="ml-auto flex items-start gap-6">{metaDates}</div>
    </div>
  ) : undefined;

  // hole 사이즈 기본 축소 + 여백 확보
  // Further reduce default hole size when not explicitly provided
  const effectiveHole = hole === undefined ? { x: '1.5rem', y: '1.5rem', w: '26rem', h: '20rem' } : hole;
  const leftPlaceholderWidth = (effectiveHole && typeof effectiveHole === 'object') ? `calc(${effectiveHole.x || '1.5rem'} + ${effectiveHole.w || '26rem'})` : undefined;

  return (
    <InfoDialog
      open={!!facility}
  title={facility.name || '시설 정보'}
      onClose={onClose}
      hole={effectiveHole}
      headerActions={headerActions}
      badges={badges}
      footer={footer}
      leftPlaceholderWidth={leftPlaceholderWidth}
    >
      <div className="flex flex-col gap-6">
        {locationBlock}
        {descriptionBlock}
      </div>
    </InfoDialog>
  );
};

export default FacilityInfoDialog;
