import {HTMLAttributes} from 'react';
import {cn} from '../../utils/classname';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>{
    variant?: 'primary' | 'destructive';
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    className?: string;   
    label?: string;
}

const Badge = ({
    variant = 'primary',
    size = 'small',
    className,
    children,
    label,
    ...props
} : BadgeProps) => {

    const badgeStyle = 'inline-flex justify-center items-center font-extrabold box-border rounded-full';
    
    const variantStyle = {
        primary : 'bg-primary-500 text-white',
        destructive : 'bg-destructive-500 text-white',
    }[variant];

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
                variantStyle,
                sizeStyle,
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;