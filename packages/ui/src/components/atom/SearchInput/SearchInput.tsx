import React from "react";
import { cn } from "../../../utils/utils";
import { Button } from '../../atom/Button/Button';
import { Input } from '../../atom/Input/Input';

interface SearchInputProps {
    buttonClassName?: string;
    className?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
    buttonClassName,
    className,
    value,
    onChange,
    onSubmit,
    placeholder
 }) => {
    return(
        <div className={cn('flex gap-0.5', className)}>
            <Input 
                className="w-60"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <Button className={cn("w-15", buttonClassName)} onClick={onSubmit}>검색</Button>
        </div>
    )
}

SearchInput.displayName = 'SearchInput';

export { SearchInput };