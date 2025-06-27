import React from "react";
import { cn } from "../../../utils/utils";
import { Label } from '../../atom/Label/Label';
import { Input } from '../../atom/Input/Input';
import { useId } from 'react';

interface LabeledInputProps {
    className?: string;
    label: string;
    value: string;
    error?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({ 
    className,
    label,
    value,
    error,
    onChange,
    placeholder
 }) => {
    const inputId = useId();

    return(
        <div className={cn('flex flex-col gap-2 my-2', className)}>
            <Label htmlFor={inputId}>{label}</Label>
            <Input 
                id={inputId}
                value={value}
                onChange={onChange}
                error={error}
                placeholder={placeholder}
            />
        </div>
    )
}

LabeledInput.displayName = 'LabeledInput';

export { LabeledInput };