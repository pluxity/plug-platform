import { cn } from '../../utils/classname';
import * as React from 'react';
import { useEffect } from 'react';
import { Button } from '../Button/Button';
import CloseIcon from '../../assets/icons/close.svg';
import type { ToastProps } from './Toast.types';
import { createPortal } from 'react-dom';


const Toast = ({
    variant = 'default',
    placement = 'bottomRight',
    duration = 300, 
    autoClose = true,
    autoCloseDuration = 3000,
    closable = false,
    onClose,
    isOpen,
    ref,
    className,
    children,
    ...props
}: ToastProps) => {

    const getPlacementClasses = (placement: string): string => {
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

    const toastStyle = 'flex gap-3 rounded-lg border border-gray-200 bg-white shadow-sm relative p-5 w-100';

    const toastVariant = {
        default: 'bg-white',
        normal: 'bg-green-100 ',
        warning: 'bg-destructive-100',
        critical: 'bg-yellow-100',
    }[variant];

    const toastAnimation = `transform transition-all duration-${duration} ${isOpen ? 'opacity-70 ease-in' : 'opacity-0 ease-out'}`;

    const toastPlacementAnimation = {
      top: isOpen ? 'translate-y-0' : 'translate-y-[-10px]',
      topLeft: isOpen ? 'translate-x-0' : 'translate-x-[-10px]',
      topRight: isOpen ? 'translate-x-0' : 'translate-x-[10px]',
      bottom: isOpen ? 'translate-y-0' : 'translate-y-[10px]',
      bottomLeft: isOpen ? 'translate-x-0' : 'translate-x-[-10px]',
      bottomRight: isOpen ? 'translate-x-0' : 'translate-x-[10px]',
      center: '',
    }[placement];

    useEffect(() => {
        if (isOpen && onClose && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDuration);
            
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoCloseDuration, onClose, autoClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className={cn(
            `fixed inset-0 z-50 flex bg-black bg-opacity-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`,
            getPlacementClasses(placement),
        )}>   
            <div
                className={cn(
                    toastStyle,
                    toastVariant,
                    toastAnimation,
                    toastPlacementAnimation,
                    className,
                )}
                ref={ref}
                {...props}
            >
                {(closable || !autoClose) && (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='absolute top-[50%] right-2 h-10 w-10 p-0 hover:bg-transparent transform translate-y-[-50%]'
                        onClick={onClose}
                        aria-label='닫기'
                    >
                        <CloseIcon />
                    </Button>
                )}
                <div>{children}</div>
            </div>
        </div>,
        document.body
    );
};

Toast.displayName = 'Toast';

const ToastTitle = ({
    ref,
    className,
    children,
    ...props
}: React.ComponentProps<'h2'>) => {

    const toastTitleStyle = 'mb-2 font-bold leading-none tracking-tight'
    return (
        <h2
            ref={ref}
            className={cn(
                toastTitleStyle,
                className
            )}
            {...props}
        >
            {children}
        </h2>
    )
}

ToastTitle.displayName = 'ToastTitle';

const ToastDescription = ({
    ref,
    className,
    children,
    ...props
}: React.ComponentProps<'p'>) => {
    return (
        <p
            ref={ref}
            className={cn(
                'text-sm',
                className
            )}
            {...props}
        >
            {children}
        </p>
    )
}

ToastDescription.displayName = 'ToastDescription';


export { Toast, ToastTitle, ToastDescription };