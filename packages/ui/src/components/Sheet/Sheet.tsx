import { cn } from '../../utils/classname';
import { createPortal } from "react-dom";
import { Button } from '../Button/Button';
import CloseIcon from '../../assets/icons/close.svg';
import { useEffect, useState } from 'react';
import type { 
    SheetPortalProps,
    SheetProps,
    SheetHeaderProps,
    SheetContentProps,
    SheetFooterProps
} from "./Sheet.types";

const SheetPortal = ({
    children,
}: SheetPortalProps) => {
    return createPortal(
        <>{children}</>,
        document.body
    )
}

SheetPortal.displayName = "SheetPortal";

const Sheet = ({
    isOpen,
    closeOnOverlayClick = true,
    closable = true,
    overlay = true,
    position = "right",
    onClose,
    className,
    children,
    ref,
    ...props
}: SheetProps) => {

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
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleTransitionEnd = () => {
        if (!isVisible) {
            onClose?.();
        }
    };
    
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    if (!isMounted) return null;
    
    const sheetStyle = cn(
        "fixed z-50 w-full bg-white p-4 shadow-lg has-[button]:pr-8",
        position === "right" && "right-0 inset-y-0 max-w-xs",
        position === "left" && "left-0 inset-y-0 max-w-xs",
        position === "top" && "inset-x-0 top-0 max-h-xs",
        position === "bottom" && "inset-x-0 bottom-0 max-h-xs"
    );

    const sheetAnimate = cn(
        "transition-transform duration-300 ease-in-out",
        position === "right" && (isVisible ? "translate-x-0" : "translate-x-full"),
        position === "left" && (isVisible ? "translate-x-0" : "-translate-x-full"),
        position === "top" && (isVisible ? "translate-y-0" : "-translate-y-full"),
        position === "bottom" && (isVisible ? "translate-y-0" : "translate-y-full")
    );

    return(
        <SheetPortal>
            {overlay && 
                <div className="fixed inset-0 z-50 bg-black/50"
                    onClick={handleOverlayClick}
                />
            }
            <div 
                className={cn(sheetStyle ,sheetAnimate)} 
                onTransitionEnd={handleTransitionEnd} 
                ref={ref}
                {...props} 
                >
                {closable && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-2 h-6 w-6 p-0 ml-auto right-sm"
                        aria-label="닫기"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </Button>
                )}
                <div className={cn("flex h-full flex-col gap-4", className)}>
                    {children}
                </div>
            </div>
        </SheetPortal>
    )
}

Sheet.displayName = "Sheet";

const SheetHeader = ({
    className,
    children,
    ref,
}: SheetHeaderProps) => {
    return(
        <div 
            className={cn(className)}
            ref={ref}
        >
            {children}
        </div>
    )
}

SheetHeader.displayName = "SheetHeader";

const SheetContent = ({
    className,
    children,
    ref,
}: SheetContentProps) => {
    return(
        <div 
            className={cn(className)}
            ref={ref}
        >
            {children}
        </div>
    )
}

SheetContent.displayName = "SheetContent";

const SheetFooter = ({
    className,
    children,
    ref,
}: SheetFooterProps) => {
    return(
        <div 
            className={cn(className)}
            ref={ref}
        >
            {children}
        </div>
    )
}

SheetFooter.displayName = "SheetFooter";

export { SheetPortal, Sheet, SheetHeader, SheetContent ,SheetFooter }