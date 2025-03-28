import {cn} from '../../utils/classname';
import type { BadgeProps } from './Badge.types';

const Badge = ({
    color = 'primary',
    size = 'small',
    className,
    children,
    label,
    ...props
} : BadgeProps) => {

    const badgeStyle = 'inline-flex justify-center items-center font-extrabold box-border rounded-full';
    
    const colorStyle = {
        primary : 'bg-primary-500 text-white',
        secondary : 'bg-secondary-500 text-white',
        destructive : 'bg-destructive-500 text-white',
    }[color];

    const sizeStyle = {
        xsmall : 'text-xs px-2 py-1',
        small : 'text-sm px-2 py-1',
        medium : 'text-base px-4 py-2',
        large : 'text-lg px-4 py-2'
    }[size];

    return(
        <span
            role="status" 
            aria-live="polite" 
            aria-label={label}
            className={cn(
                badgeStyle,
                colorStyle,
                sizeStyle,
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export {Badge};