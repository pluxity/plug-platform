import * as React from "react";
import { cn } from "../../../utils/utils";
import { 
    Command,
    CommandInput,
    CommandList,
    CommandItem,
 } from "../../atom/Command/Command";
import { X } from "lucide-react";
import { Button } from "../../atom/Button/Button";

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  clearButtonClassName?: string;
}

const SearchForm = ({ 
    value, 
    onChange, 
    onSelect, 
    suggestions,
    placeholder = "검색어 입력",
    className,
    inputClassName,
    listClassName,
    itemClassName,
    clearButtonClassName,
}: SearchFormProps) => {

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("relative")}>
      <Command
        className={cn("rounded-sm border border-gray-200 bg-white text-black border-b-0", className)}
        onFocus={() => setOpen(true)}
      >
        <div className="relative flex items-center">
          <CommandInput
            ref={inputRef}
            value={value}
            onValueChange={onChange}
            placeholder={placeholder}
            className={cn("flex-1 h-full border-none outline-none text-black placeholder:text-gray-400 text-sm pr-8", inputClassName)}
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="검색어 삭제"
              onClick={(e) => {
                e.preventDefault();
                onChange("");
              }}
              className={cn("absolute right-1", clearButtonClassName)}
            >
              <X className="size-4 text-gray-400" />
            </Button>
          )}
        </div>

        {open && (
          <CommandList className={cn("absolute top-full left-0 right-0 mt-1 max-h-60 overflow-auto rounded-sm border border-gray-200 bg-white z-50", listClassName)}>
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => (
                <CommandItem
                  key={idx}
                  value={item}
                  onSelect={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                  className={itemClassName}
                >
                  {item}
                </CommandItem>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400 text-sm">검색 결과가 없습니다.</div>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}

SearchForm.displayName = "SearchForm";
export { SearchForm }
