import React from 'react'

export interface InfoDialogHoleConfig { x?: string; y?: string; w?: string; h?: string }

export interface InfoDialogProps {
  open: boolean
  title: string
  onClose?: () => void
  /** Optional masked hole (media area) top-left (x,y) and size (w,h) in css units (defaults for facility variant). */
  hole?: InfoDialogHoleConfig | false
  /** Optional actions placed next to the title (e.g. 진입 button). */
  headerActions?: React.ReactNode
  /** Badges / chips row under title. */
  badges?: React.ReactNode
  /** Main scrollable content (below title area, above footer). */
  children?: React.ReactNode
  /** Footer actions area (bottom right). */
  footer?: React.ReactNode
  /** Override total dialog width (defaults to 2/3 screen for facility style). */
  className?: string
  /** Left placeholder width (space reserved for media hole). Supply CSS width value. */
  leftPlaceholderWidth?: string
}

const defaultHole: Required<InfoDialogHoleConfig> = { x: '2rem', y: '2rem', w: '45rem', h: '35rem' }

export const InfoDialog: React.FC<InfoDialogProps> = ({
  open,
  title,
  onClose,
  hole = defaultHole,
  headerActions,
  badges,
  children,
  footer,
  className,
  leftPlaceholderWidth
}) => {
  if (!open) return null

  const appliedHole = hole && { ...defaultHole, ...hole }
  const maskStyle: React.CSSProperties | undefined = appliedHole ? {
    WebkitMask: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
    mask: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude' as unknown as string,
    WebkitMaskRepeat: 'no-repeat, no-repeat',
    maskRepeat: 'no-repeat, no-repeat',
    WebkitMaskPosition: `0 0, ${appliedHole.x} ${appliedHole.y}`,
    maskPosition: `0 0, ${appliedHole.x} ${appliedHole.y}`,
    WebkitMaskSize: `100% 100%, ${appliedHole.w} ${appliedHole.h}`,
    maskSize: `100% 100%, ${appliedHole.w} ${appliedHole.h}`
  } : undefined

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-[70]">
      <div
        className={[
          'relative h-[38.75rem] rounded-2xl flex text-slate-100 bg-gradient-to-br',
          'from-slate-900/80 via-slate-800/70 to-slate-700/60 backdrop-blur-xs',
          'border border-white/10 shadow-2xl w-2/3 max-w-[96rem] max-h-[90vh]',
          className || ''
        ].join(' ')}
        style={maskStyle}
      >
        {appliedHole && (
          <div className="shrink-0 h-full" style={{ width: leftPlaceholderWidth || `calc(${appliedHole.w} + 0.5rem)` }} />
        )}
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
                <h2 className="text-[2.75rem] leading-[1.05] font-semibold tracking-tight text-white drop-shadow break-words">
                  {title}
                </h2>
                {headerActions}
              </div>
              {badges && (
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">{badges}</div>
              )}
            </div>
          </div>
          {children}
          {footer && (
            <div className="mt-auto pt-4 flex items-center justify-end gap-4">{footer}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoDialog
