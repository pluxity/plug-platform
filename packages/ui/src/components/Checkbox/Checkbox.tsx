import {HTMLAttributes} from 'react';
import clsx from 'clsx';

export interface CheckboxProps extends HTMLAttributes<HTMLInputElement>{
    variant?: 'primary';
    className?: string;
}

const Checkbox = ({
    variant = 'primary',
    className,
    children,
    ...props
} : checkboxProps) => {

    const inputStyle = '';
    const labelStyle = '';

    const variantStyle = {

    }[variant];

    const sizeStyle = {
        small : '',
    }

    return(
        <label 
            type="checkbox"
            id=""
        >
            <input />
            {children}
        </label>
    );
}

export default Checkbox;
