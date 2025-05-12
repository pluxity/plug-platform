import React from 'react';
import { Dialog } from '../Dialog/Dialog';
import { Button } from '../Button/Button';
import { cn } from '../../utils/classname';
import CloseIcon from '../../assets/icons/close.svg';
import { ModalProps } from './Modal.types';

const Modal = React.memo(({ 
    children, 
    title, 
    footer, 
    width = '500px', 
    height = 'auto', 
    closable = true, 
    contentClassName,
    headerClassName,
    bodyClassName,
    footerClassName,
    ref,
    ...props 
  }: ModalProps) => {
    const widthClass = typeof width === 'number' ? `w-[${width}px]` : `w-[${width}]`;
    const heightClass = typeof height === 'number' ? `h-[${height}px]` : `h-[${height}]`;

    return (
      <Dialog 
        {...props} 
        ref={ref}
        closeOnOverlayClick={false}
        contentClassName={cn(
          "max-w-[90vw] max-h-[90vh] flex flex-col overflow-hidden",
          contentClassName
        )}
      >
        <div 
          className={cn(
            "flex flex-col w-full h-full",
            widthClass,
            heightClass
          )}
        >
          {(title || closable) && (
            <div className={cn(
              "flex items-center justify-between px-6 py-4 border-b border-gray-200",
              headerClassName
            )}>
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {closable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 ml-auto"
                  onClick={props.onClose}
                  aria-label="닫기"
                >
                  <CloseIcon />
                </Button>
              )}
            </div>
          )}
          
          <div className={cn(
            "flex-1 p-6 overflow-auto",
            bodyClassName
          )}>
            {children}
          </div>
          
          {footer && (
            <div className={cn(
              "px-6 py-4 border-t border-gray-200 flex justify-end gap-2",
              footerClassName
            )}>
              {footer}
            </div>
          )}
        </div>
      </Dialog>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal }; 