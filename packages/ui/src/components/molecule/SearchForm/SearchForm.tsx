import { cn } from "../../../utils/utils";
import { 
    Command,
    CommandInput,
    CommandList,
    CommandItem,
 } from "../../atom/Command/Command";
import { X } from "lucide-react";
import { Button } from "../../atom/Button/Button";
import { debounce } from "lodash";
import { SearchFormProps } from "./SearchForm.types";
import React, { useState, useRef, useMemo, useEffect } from "react";
function SearchForm({ 
    value, 
    onChange, 
    onSelect, 
    placeholder = "검색어 입력",
    className,
    inputClassName,
    listClassName,
    itemClassName,
    clearButtonClassName,
    onSearch,
    searchResult,
}: SearchFormProps) {

  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  // onSearch가 있을 때만 디바운스 적용
  const searchDebounce = useMemo(
    () => debounce((search: string) => {
      if (onSearch) {
        onSearch(search);
      }
    }, onSearch ? 300 : 0),
    [onSearch]
  );

  const handleChange = (search: string) => {
    onChange(search);
    
    // 디바운스된 검색 실행
    searchDebounce(search);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onChange("");
    setOpen(false);
  }

  // searchResult 변경시 드롭다운 상태 업데이트
  useEffect(() => {
    if (value.trim().length > 0 && searchResult && searchResult.length > 0) {
      setOpen(true);
    } else if (value.trim().length === 0) {
      setOpen(false);
    } else if (value.trim().length > 0 && searchResult && searchResult.length === 0) {
      setOpen(true); // 결과 없음 메시지도 표시
    }
  }, [searchResult, value]);

  const suggestions = searchResult || [];

  return (
    <div className={cn("relative")} >
      <Command 
        className={cn("rounded-sm border border-gray-200 bg-white text-black border-b-0", className)}
      >
        <div className="relative flex items-center">
          <CommandInput
            ref={inputRef}
            value={value}
            onValueChange={handleChange}
            placeholder={placeholder}
            className={cn("flex-1 h-full border-none outline-none text-black placeholder:text-gray-400 text-sm pr-8", inputClassName)}
          />
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="검색어 삭제"
              onClick={handleClear}
              className={cn("absolute right-1", clearButtonClassName)}
            >
              <X className="size-4 text-gray-400" />
            </Button>
          )}
        </div>

        {open && (
          <CommandList 
            className={cn("absolute top-full left-0 right-0 mt-1 max-h-60 overflow-auto rounded-sm border border-gray-200 bg-white shadow-lg", listClassName)} 
          >
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
