import React from "react";
import { cn } from "../../../utils/utils";
import { Button } from '../../atom/Button/Button';
import { Input } from '../../atom/Input/Input';

interface SearchInputProps {
    className?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
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
            <Button className="w-15" onClick={onSubmit}>검색</Button>
        </div>
    )
}

SearchInput.displayName = 'SearchInput';

export { SearchInput };