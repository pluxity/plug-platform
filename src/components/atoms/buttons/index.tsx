import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'text' | 'outlined' | 'icon';
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary';
    className?: string;
}

const Button = ({ 
    variant = 'text',
    size = 'medium',
    color = 'primary',
    className,
    children,
    ...props 
}: ButtonProps) => {

    const buttonStyle = 'flex justify-center gap-2 items-center px-4 py-2 rounded font-semibold'
    
    const variantStyle = {
        text: "",
        icon: "bg-transparent",
        outlined: "border border-gray-300",
    }[variant];
    
    const sizeStyle = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
    }[size];
    
    const colorStyle = {
        primary: "text-white bg-blue-500 hover:bg-blue-600",
        secondary: "text-gray-700 bg-gray-300 hover:bg-gray-400",
    }[color];

    return (
        <button
            className={clsx(
                buttonStyle, variantStyle, sizeStyle, colorStyle,
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;