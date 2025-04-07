import React from 'react';
import { Dialog } from '../Dialog/Dialog';
import { Button } from '../Button/Button';
import { cn } from '../../utils/classname';
import CloseIcon from '../../assets/icons/close.svg';
import { PopupProps, PopupPlacement } from './Popup.types';

const getPlacementClasses = (placement: PopupPlacement): string => {
  switch (placement) {
    case 'top':
      return 'items-start justify-center pt-4';
    case 'topLeft':
      return 'items-start justify-start p-4';
    case 'topRight':
      return 'items-start justify-end p-4';
    case 'bottom':
      return 'items-end justify-center pb-4';
    case 'bottomLeft':
      return 'items-end justify-start p-4';
    case 'bottomRight':
      return 'items-end justify-end p-4';
    case 'center':
    default:
      return 'items-center justify-center';
  }
};

const Popup = React.memo(({ 
    children, 
    title, 
    placement = 'center', 
    width = '300px', 
    closable = true, 
    contentClassName,
    headerClassName,
    bodyClassName,
    overlayClassName,
    ref,
    ...props 
  }: PopupProps) => {
    const widthClass = typeof width === 'number' ? `w-[${width}px]` : `w-[${width}]`;

    return (
      <Dialog 
        {...props} 
        ref={ref}
        closeOnOverlayClick={true}
        overlayClassName={cn(
          getPlacementClasses(placement),
          overlayClassName
        )}
        contentClassName={cn(
          "max-w-[90vw] shadow-lg",
          contentClassName
        )}
      >
        <div 
          className={cn(
            "flex flex-col w-full",
            widthClass
          )}
        >
          {(title || closable) && (
            <div className={cn(
              "flex items-center justify-between px-4 py-3 border-b border-gray-200",
              headerClassName
            )}>
              {title && (
                <h3 className="text-base font-medium text-gray-900">
                  {title}
                </h3>
              )}
              {closable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0 ml-auto"
                  onClick={props.onClose}
                  aria-label="닫기"
                >
                  <CloseIcon />
                </Button>
              )}
            </div>
          )}
          
          <div className={cn(
            "p-4",
            bodyClassName
          )}>
            {children}
          </div>
        </div>
      </Dialog>
    );
  });

Popup.displayName = 'Popup';

export { Popup }; 