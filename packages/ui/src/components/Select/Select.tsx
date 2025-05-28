import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
} from "react";
import { cn } from "../../utils/classname";
import { SelectCloseIcon } from "../../index.icons";
import type {
    SelectProps,
    SelectTriggerProps,
    SelectItemProps,
} from "./Select.types";

interface SelectContextProps {
    type: "single" | "multiple";
    variant: "default" | "error";
    disabled: boolean;
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
    selectedValues: string[];
    setSelectedValues: (values: string[]) => void;
    selectedItems: Map<string, React.ReactNode>; 
    setSelectedItems: (items: Map<string, React.ReactNode>) => void;
    toggleValue: (value: string, item?: React.ReactNode) => void;
    searchValue: string;
    setSearchValue: (value: string) => void;
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined);

const Select = ({
                    type = "single",
                    variant = "default",
                    disabled = false,
                    selected,
                    onChange,
                    className,
                    children,
                    ...props
                }: SelectProps) => {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<Map<string, React.ReactNode>>(new Map());

    const [searchValue, setSearchValue] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const isControlled = selected !== undefined;
    const currentSelected = isControlled ? selected : selectedValues;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsSelectOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);    const toggleValue = (value: string, item?: React.ReactNode) => {
        if (type === "single") {
            const newValue = [value];
            if (!isControlled) setSelectedValues(newValue);
            
            // 단일 선택에서는 Map을 비우고 새 항목 추가
            const newItems = new Map<string, React.ReactNode>();
            if (item) newItems.set(value, item);
            setSelectedItems(newItems);
            
            onChange?.(newValue);
            setIsSelectOpen(false);
        } else {
            const set = new Set(currentSelected);
            const hasValue = set.has(value);
            
            // 값의 존재 여부에 따라 추가/제거
            if (hasValue) {
                set.delete(value);
                // 아이템도 제거
                const newItems = new Map(selectedItems);
                newItems.delete(value);
                setSelectedItems(newItems);
            } else {
                set.add(value);
                // 아이템 추가
                if (item) {
                    const newItems = new Map(selectedItems);
                    newItems.set(value, item);
                    setSelectedItems(newItems);
                }
            }
            
            const newValue = Array.from(set);
            if (!isControlled) setSelectedValues(newValue);
            onChange?.(newValue);
            setSearchValue("");
        }
    };    return (
        <SelectContext.Provider
            value={{
                type,
                variant,
                disabled,
                isSelected: isSelectOpen,
                setIsSelected: setIsSelectOpen,
                selectedValues: currentSelected,
                setSelectedValues,
                selectedItems,
                setSelectedItems,
                toggleValue,
                searchValue,
                setSearchValue,
            }}
        >
            <div
                ref={ref}
                role="combobox"
                aria-expanded={isSelectOpen}
                aria-haspopup="listbox"
                className={cn("relative w-full", className)}
                {...props}
            >
                {children}
            </div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = ({
                           placeholder = "선택하세요.",
                           inputClassName,
                           className,
                           ...props
                       }: SelectTriggerProps) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger는 Select 내부에서 사용해야 합니다.");

    const {
        isSelected,
        setIsSelected,
        selectedItems,
        selectedValues,
        variant,
        type,
        disabled,
        searchValue,
        setSearchValue,
        toggleValue,
    } = context;

    const variantStyle =
        variant === "error"
            ? "border-rose-500 text-rose-600"
            : "border-slate-300 text-slate-800";

    return (
        <div
            onClick={() => !disabled && setIsSelected(!isSelected)}
            className={cn(
                "h-10 w-full flex flex-wrap items-start gap-1 rounded-md px-3 py-2 border bg-white transition-all",
                "focus-within:ring-2 focus-within:ring-blue-500",
                "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                disabled && "bg-slate-100 text-slate-400 cursor-not-allowed",
                variantStyle,
                className
            )}
            {...props}
        >
            {type === "multiple" ? (
                <>
                    {selectedValues.map((value: string) => (
                        <span
                            key={value}
                            className="flex items-center gap-1 bg-slate-200 text-slate-800 px-2 py-0.5 text-sm rounded"
                        >
                        {selectedItems.get(value) || value}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleValue(value);
                                }}
                                className="text-slate-500 hover:text-slate-800"
                            >
                <SelectCloseIcon />
              </button>
            </span>
                    ))}
                    <input
                        className={cn(
                            "flex-1 min-w-[60px] text-sm bg-transparent outline-none",
                            inputClassName
                        )}
                        placeholder={selectedValues.length === 0 ? placeholder : ""}
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            if (!isSelected) setIsSelected(true);
                        }}
                    />
                </>
            ) : (
                <>
                    <span
                        className="text-slate-800 text-sm block flex flex-row"
                        >
                        {selectedValues.length > 0
                            ? (selectedItems.get(selectedValues[0]) || selectedValues[0]) 
                            : placeholder}
                        <input
                            className={cn(
                                "cursor-pointer outline-none opacity-0 w-0",
                                inputClassName
                            )}
                            placeholder={placeholder}
                            value={selectedValues[0] || ""}
                            readOnly
                        />
                    </span>
                </>
            )}
        </div>
    );
};

const SelectContent = ({
                           className,
                           children,
                           ...props
                       }: React.ComponentProps<"ul">) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectContent는 Select 내부에서 사용해야 합니다.");

    const { isSelected, searchValue, variant } = context;
    if (!isSelected) return null;

    const filtered = React.Children.toArray(children).filter((child) => {
        if (React.isValidElement(child) && searchValue) {
            const { children } = child.props as SelectItemProps;
            return children?.toString().toLowerCase().includes(searchValue.toLowerCase());
        }
        return true;
    });

    return (
        <ul
            role="listbox"
            className={cn(
                "absolute z-50 mt-1 w-full max-h-48 rounded-md border bg-white shadow-md overflow-y-auto p-2 text-sm",
                "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                variant === "error" ? "border-rose-500" : "border-slate-300",
                className
            )}
            {...props}
        >
            {filtered.length > 0 ? (
                filtered
            ) : (
                <li className="text-slate-400 px-2 py-1 text-center">검색 결과가 없습니다.</li>
            )}
        </ul>
    );
};

const SelectItem = ({
                        value,
                        className,
                        children,
                        ...props
                    }: SelectItemProps) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error("SelectItem은 Select 내부에서 사용해야 합니다.");

    const { selectedValues, toggleValue, variant } = context;
    const isSelected = selectedValues.includes(value);

    return (
        <li
            role="option"
            aria-selected={isSelected}
            className={cn(
                "px-3 py-2 cursor-pointer rounded-md transition-colors",
                "hover:bg-slate-100 text-slate-700 border-white border-[1px]",
                isSelected && "bg-slate-200 text-blue-600 font-medium border-white border-[1px]",
                variant === "error" && isSelected && "text-rose-600",
                className
            )}
            onClick={() => toggleValue(value, children)}
            {...props}
        >
            {children}
        </li>
    );
};

export { Select, SelectTrigger, SelectContent, SelectItem };