import { cn } from "../../../utils/utils";
import { SearchInput } from "../../atom/SearchInput/SearchInput";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../atom/Select/Select';

type SelectOption = { 
    label: string; 
    value: string 
};

type FilterSelect = {
    key: string;
    placeholder?: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
};

interface FilterBarProps {
    selects: FilterSelect[];
    showSearchInput?: boolean;
    searchValue?: string;
    onSearch?: (value: string) => void;
    searchPlaceholder?: string;
    onSubmit?: () => void;
    className?: string;
};

const FilterBar: React.FC<FilterBarProps> = ({
                                            selects,
                                            showSearchInput = true,
                                            searchValue,
                                            onSearch,
                                            searchPlaceholder = "검색어를 입력하세요.",
                                            onSubmit,
                                            className,
}) => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit?.();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        onSearch?.(inputValue); 
      };

    return(
        <form
            className={cn("flex gap-2 items-center", className)}
            onSubmit={handleSubmit}
        >
            {selects.map((select) => (
            <Select
                key={select.key}
                value={select.value}
                onValueChange={select.onChange}
            >
                <SelectTrigger>
                <SelectValue placeholder={select.placeholder} />
                </SelectTrigger>
                <SelectContent>
                {select.options.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            ))}
            {showSearchInput && (
            <SearchInput
                value={searchValue ?? ""}
                onChange={handleChange}
                placeholder={searchPlaceholder}
                onSubmit={() => onSearch?.(searchValue ?? "")}
            />
            )}
        </form>
    )

};

FilterBar.displayName = "FilterBar";

export { FilterBar };
