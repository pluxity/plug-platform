import React from 'react';

export interface InfoDialogHoleConfig { x?: string; y?: string; w?: string; h?: string }

export interface InfoDialogProps {
  open: boolean;
  title: string;
  onClose?: () => void;
  hole?: InfoDialogHoleConfig | false;
  headerActions?: React.ReactNode;
  badges?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  leftPlaceholderWidth?: string;
  variant?: 'default' | 'compact';
  titleClassName?: string;
  bodyClassName?: string;
  dialogHeightClass?: string;
  dialogWidthClass?: string;
}

// Reduced default hole size for a more compact layout
const defaultHole: Required<InfoDialogHoleConfig> = { x: '1.75rem', y: '1.75rem', w: '32rem', h: '24rem' };

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
  footer,
  variant = 'default',
  titleClassName,
  bodyClassName,
  dialogHeightClass,
  dialogWidthClass,
}: InfoDialogProps) => {
  if (!open) return null;

  const appliedHole = hole && { ...defaultHole, ...hole };
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
  } : undefined;

  const isCompact = variant === 'compact';

  const sizeClass = isCompact
    ? 'w-auto'
    : [
        dialogWidthClass || 'w-[52rem]', // width only; height becomes dynamic
        'max-w-[72rem]'
  ].join(' ');

  const dynamicSizingStyle: React.CSSProperties = {};
  if (!isCompact && appliedHole) {
  dynamicSizingStyle.minHeight = `calc(${appliedHole.y} + ${appliedHole.h} + 1.5rem)`;
  }
  if (!isCompact && !dialogHeightClass) {
  dynamicSizingStyle.height = 'auto';
  } 
  
  const containerBase = [
    'relative flex text-secondary-100 bg-gradient-to-br',
    'bg-primary-1000/60 backdrop-blur-sm',
    'border border-primary-1000/30 rounded-2xl',
    sizeClass
  ].join(' ');

  const bodyWrapperClass = isCompact
    ? 'flex flex-col flex-1 p-3 gap-3 pointer-events-auto overflow-hidden relative'
  : 'flex flex-col flex-1 p-5 gap-6 pointer-events-auto overflow-hidden relative';

  const bodyInlineStyle: React.CSSProperties | undefined = (!isCompact && appliedHole)
    ? { paddingTop: appliedHole.y }
  : undefined;

  const closeBtnClass = isCompact
    ? 'absolute top-2 right-2 w-7 h-7 rounded-md flex items-center justify-center text-secondary-100 hover:text-secondary-100 hover:bg-secondary-100/10 active:scale-[0.95] transition'
  : 'absolute top-3 right-3 w-12 h-12 rounded-xl flex items-center justify-center text-secondary-100 hover:text-secondary-100 hover:bg-secondary-100/10 active:scale-[0.95] transition';

  const titleClass = [
    isCompact ? 'text-base font-semibold tracking-tight text-secondary-100' : 'text-[1.5rem] leading-snug font-semibold tracking-tight text-secondary-100 drop-shadow',
    'break-words',
    titleClassName || ''
  ].join(' ');

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-[70] p-2">
      <div
        className={[containerBase, className || ''].join(' ')}
        style={{ ...(maskStyle || {}), ...dynamicSizingStyle }}
        >
        {appliedHole && !isCompact && (
          <div
            className="shrink-0"
            style={{
              width: leftPlaceholderWidth || `calc(${appliedHole.x} + ${appliedHole.w})`
            }}
          />
        )}
        <div className={[bodyWrapperClass, bodyClassName || ''].join(' ')} style={bodyInlineStyle}>
          <button
            onClick={onClose}
            className={closeBtnClass}
            aria-label="닫기"
          >
            <span className={isCompact ? 'text-base font-light' : 'text-2xl font-light tracking-tight'}>✕</span>
          </button>
          <div className={isCompact ? 'flex items-center gap-2 pr-6' : 'flex items-start gap-4 pr-12'}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 flex-wrap">
                <h4 className={titleClass}>{title}</h4>
                {headerActions}
              </div>
              {!isCompact && badges && (
                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-medium">{badges}</div>
              )}
            </div>
          </div>
          {children}
          {footer && (
            <div className={isCompact ? 'pt-2 border-t border-secondary-100/10 flex flex-wrap gap-2' : 'mt-auto pt-2 border-t border-secondary-100/10 flex flex-wrap gap-3'}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoDialog;
