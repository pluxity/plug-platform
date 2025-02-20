import { useState, HTMLAttributes } from 'react';
import { cn } from '../../utils/classname';

export interface CheckboxProps extends HTMLAttributes<HTMLInputElement> {
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    className?: string;
    disabled?: boolean;
}

const Checkbox = ({
    variant = 'primary',
    size = 'small',
    disabled = false,
    children,
    className,
    ...props
}: CheckboxProps) => {

    // 체크박스 input 스타일
    const inputStyle = 'inline-block border-1 rounded-sm relative after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:w-1/3 after:h-1/3 after:border-t-2 after:border-r-2 after:transform after:rotate-132'; 

    const inputSizeStyle = {
        small: 'w-4 h-4',
        medium: 'w-5 h-5',
        large: 'w-6 h-6',
    }[size];
    
    const inputVariantStyle = {
        primary: 'bg-white border-black after:border-black',
        secondary: 'bg-white border-secondary-500 after:border-black'
    }[variant];

    const inputCheckboxStyle = {
        primary: 'bg-primary-500 border-primary-500',
        secondary: 'bg-secondary-500 border-secondary-500',
    }[variant];

    const inputDisabledStyle = disabled ? 'bg-gray-200 border-gray-300 cursor-not-allowed' : '';


    // 체크박스 label 스타일
    const labelStyle = "cursor-pointer inline-flex gap-x-1 items-center";
    const labelSizeStyle = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
    }[size];
    
    const labelVariantStyle = {
        primary: 'text-black',
        secondary: 'text-secondary-500',
    }[variant];

    const labelDisabledStyle = disabled ? 'text-gray-400' : '';


    // 체크박스 동작 
    const [checked, setChecked] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
    }

    return (
        <label
            role="checkbox"  
            aria-checked={checked}
            htmlFor="checkbox" 
            className={cn(
                labelStyle,
                labelSizeStyle,
                labelVariantStyle,
                labelDisabledStyle,
                className
            )}
        >
            <input
                type="checkbox"
                id="checkbox"
                className="absolute opacity-0"
                disabled={disabled}
                checked={checked}
                onChange={handleChange}
                {...props}
            />
            <span
                className={cn(
                    inputStyle,
                    inputSizeStyle,
                    inputVariantStyle, 
                    inputDisabledStyle,
                    checked ? `after:block after:border-white ${inputCheckboxStyle}` : 'after:hidden', 'transition-all duration-300' 
                )}
            >
            </span>
            {children}
        </label>
    );
}

export default Checkbox;
