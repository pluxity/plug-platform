import { cn } from '../../utils/classname';
import { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import CloseIcon from '../../assets/icons/close.svg';
import { createPortal } from 'react-dom';
import type { 
    ToastPortalProps,
    ToastProps,
    ToastTitleProps,
    ToastDescriptionProps
 } from './Toast.types';

const ToastPortal = ({
    children,
}: ToastPortalProps) => {
    return createPortal(
        <>{children}</>,
        document.body
    )
}

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
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setIsMounted(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration]);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, autoCloseDuration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoCloseDuration]);

    const handleTransitionEnd = () => {
        if (!isVisible) {
            onClose?.();
        }
    };

    if (!isMounted) return null;

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

    const toastAnimation = `transform transition-all duration-${duration} ${isVisible ? 'opacity-70 ease-in' : 'opacity-0 ease-out'}`;

    const toastPlacementAnimation = {
      top: isVisible ? 'translate-y-0' : 'translate-y-[-10px]',
      topLeft: isVisible ? 'translate-x-0' : 'translate-x-[-10px]',
      topRight: isVisible ? 'translate-x-0' : 'translate-x-[10px]',
      bottom: isVisible ? 'translate-y-0' : 'translate-y-[10px]',
      bottomLeft: isVisible ? 'translate-x-0' : 'translate-x-[-10px]',
      bottomRight: isVisible ? 'translate-x-0' : 'translate-x-[10px]',
      center: '',
    }[placement];

    return (
        <ToastPortal>
            <div className={cn(
                `fixed inset-0 z-50 flex bg-black bg-opacity-50 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`,
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
                    onTransitionEnd={handleTransitionEnd}
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
            </div>
        </ToastPortal>
    );
};

Toast.displayName = 'Toast';

const ToastTitle = ({
    ref,
    className,
    children,
    ...props
}: ToastTitleProps) => {

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
}: ToastDescriptionProps) => {
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