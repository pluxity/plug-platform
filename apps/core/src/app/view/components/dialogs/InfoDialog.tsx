import React from 'react'

export interface InfoDialogHoleConfig { x?: string; y?: string; w?: string; h?: string }

export interface InfoDialogProps {
  open: boolean
  title: string
  onClose?: () => void
  hole?: InfoDialogHoleConfig | false
  headerActions?: React.ReactNode
  badges?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  leftPlaceholderWidth?: string
  variant?: 'default' | 'compact'
  titleClassName?: string
  bodyClassName?: string
  dialogHeightClass?: string
  dialogWidthClass?: string
}

const defaultHole: Required<InfoDialogHoleConfig> = { x: '2rem', y: '2rem', w: '45rem', h: '35rem' }

export const InfoDialog = ({
  open,
  title,
  onClose,
  hole = defaultHole,
  headerActions,
  badges,
  children,
  className,
  leftPlaceholderWidth,
  variant = 'default',
  titleClassName,
  bodyClassName,
  dialogHeightClass,
  dialogWidthClass
}: InfoDialogProps) => {
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

  const isCompact = variant === 'compact'

  const sizeClass = isCompact
    ? 'max-h-[92vh] w-auto'
    : [
        dialogHeightClass || 'h-[32rem]',
        dialogWidthClass || 'w-[80rem]',
        'max-w-[96rem] max-h-[90vh]'
      ].join(' ')

  const containerBase = [
    'relative flex text-slate-100 bg-gradient-to-br',
    'from-slate-900/90 via-slate-800/80 to-slate-700/70 backdrop-blur-sm',
    'border border-white/10 shadow-2xl rounded-2xl',
    sizeClass
  ].join(' ')

  const bodyWrapperClass = isCompact
    ? 'flex flex-col flex-1 p-4 gap-4 pointer-events-auto overflow-hidden relative'
    : 'flex flex-col flex-1 p-10 pl-14 gap-8 pointer-events-auto overflow-hidden relative'

  const closeBtnClass = isCompact
    ? 'absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-[0.95] transition'
    : 'absolute top-4 right-4 w-16 h-16 rounded-2xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 active:scale-[0.95] transition'

  const titleClass = [
    isCompact ? 'text-lg font-semibold tracking-tight text-white' : 'text-[2.75rem] leading-[1.05] font-semibold tracking-tight text-white drop-shadow',
    'break-words',
    titleClassName || ''
  ].join(' ')

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-[70] p-2">
      <div
        className={[containerBase, className || ''].join(' ')}
        style={maskStyle}
      >
        {appliedHole && !isCompact && (
          <div className="shrink-0 h-full" style={{ width: leftPlaceholderWidth || `calc(${appliedHole.w} + 0.5rem)` }} />
        )}
        <div className={[bodyWrapperClass, bodyClassName || ''].join(' ')}>
          <button
            onClick={onClose}
            className={closeBtnClass}
            aria-label="닫기"
          >
            <span className={isCompact ? 'text-base font-light' : 'text-2xl font-light tracking-tight'}>✕</span>
          </button>
          <div className={isCompact ? 'flex items-center gap-3 pr-8' : 'flex items-start gap-5 pr-16'}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 flex-wrap">
                <h4 className={titleClass}>{title}</h4>
                {headerActions}
              </div>
              {!isCompact && badges && (
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium">{badges}</div>
              )}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default InfoDialog
