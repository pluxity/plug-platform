import { cn } from "../../../utils/utils";
import { Label } from '../../atom/Label/Label';
import { Input } from '../../atom/Input/Input';
import { useId } from 'react';
import { LabeledInputProps } from './LabeldInput.types';

function LabeledInput({ 
    className,
    label,
    value,
    error,
    onChange,
    placeholder
 }: LabeledInputProps) {
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