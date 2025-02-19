import {HTMLAttributes} from 'react';
import {cn} from '../../utils/classname';

export interface CheckboxProps extends HTMLAttributes<HTMLInputElement>{
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const Checkbox = ({
    variant = 'primary',
    size = 'small',
    children,
    className,
    ...props
} : CheckboxProps) => {

    // 체크박스 input 버튼 스타일
    const inputStyle = 'w-5 h-5 inline-block border-1 rounded-sm'; 
    const inputSizeStyle = {
        small: 'w-4 h-4',
        medium: 'w-5 h-5',
        large: 'w-6 h-6',
    }[size];
    const inputVariantStyle = {
        primary: 'bg-white',
        secondary: 'border-blue-400',
    }[variant];
    
    // 체크박스 label 버튼 스타일
    const labelStyle = "cursor-pointer inline-flex gap-x-1 items-center";
    const labelSizeStyle = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
    }[size];
    const labelVariantStyle = {
        primary: 'bg-white',
        secondary: 'border-blue-400 text-blue-400',
    }[variant];
    
    
    return(
        <label
            htmlFor="checkbox" 
            className={cn(
                labelStyle,
                labelSizeStyle,
                labelVariantStyle,
                className
            )} 
            >
            <input type="checkbox" id="checkbox" className="absolute opacity-0"/>
            <span
                className={cn(
                     inputStyle,
                     inputSizeStyle,
                     inputVariantStyle, 
                )}
                {...props}
            >
                <span
                    className={cn(
                    'w-full h-full bg-transparent transition-all duration-300'
                )}
                />
            </span>
            {children}
    </label>
    );
}

export default Checkbox;
