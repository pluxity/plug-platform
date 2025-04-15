import { createContext, useState, useContext } from "react";
import { cn } from "../../utils/classname";
import { SelectCloseIcon } from "../../index.icons"; 
import type { 
    SelectProps,
    SelectTriggerProps,
    SelectItemProps,
 } from "./Select.types";
import React from "react";

interface SelectContextProps{
    type: "single" | "multiple";
    variant: "default" | "error";
    disabled: boolean;
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
    selectedValue: string[];
    toggleValue: (value: string) => void;
    searchValue: string;
    setSearchValue: (value: string) => void;
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined);

const Select = ({
    type = "single",
    variant= "default",
    disabled = false,
    selected,
    onChange,
    className,
    children,
    ...props
}: SelectProps) => {

    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string[]>([]);
    const [searchValue, setSearchValue] = useState("");
    
    const isControlled = selected !== undefined;
    const currentSelected = isControlled ? selected : selectedValue;

    const toggleValue = (value: string) => {
        if (type === "single") {
            const newSelectedValues = [value];
            if(!isControlled) {
                setSelectedValue(newSelectedValues);
            }
            if (onChange) {
                onChange(newSelectedValues);
            }
            setIsSelectOpen(false);
        } else if (type === "multiple") {

            const selectedValuesSet = new Set(currentSelected);

            if (selectedValuesSet.has(value)) {
                selectedValuesSet.delete(value);
            } else {
                selectedValuesSet.add(value);
            }
            
            const newSelectedValues = [...selectedValuesSet];
            
            if(!isControlled) {
                setSelectedValue(newSelectedValues);
            }
            if (onChange) {
                onChange(newSelectedValues);
            }
            setSearchValue("");
        }
    };

    return(
        <SelectContext.Provider value={{
            isSelected: isSelectOpen,
            setIsSelected: setIsSelectOpen,
            toggleValue,
            selectedValue: currentSelected,
            variant,
            disabled,
            searchValue,
            setSearchValue,
            type
        }}>
            <div
                className={cn(
                    "relative inline-block",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </SelectContext.Provider>
    )
}

Select.displayName = "Select";

const SelectTrigger = ({
    placeholder = "선택하세요.",
    inputClassName,
    className,
    ...props
}: SelectTriggerProps) => {
    const context = useContext(SelectContext);

    if (!context) {
      throw new Error("SelectTrigger는 Select 구성 요소 내에서 사용해야 합니다. <Select.Trigger>이 <Select> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }
  
    const { isSelected, setIsSelected, selectedValue, variant, type, disabled, searchValue, setSearchValue } = context;

    const selectTriggerStyle = `flex items-center p-1 border border-1 border-gray-400 bg-white text-left relative after:absolute after:content-[''] after:border-t-1 after:border-r-1 after:top-1/2 after:right-3 after:transform after:rotate-135 after:translate-y-[-50%] after:w-2 after:h-2 transition-all duration-300 w-full rounded-xs pr-6
    ${disabled ? "cursor-not-allowed bg-gray-200" : ""}`;
    const SelectTriggerVariant = {
        default: `${isSelected ? 'after:border-black' : 'after:border-gray-400'}`,
        error: `${isSelected ? 'border-destructive-500 after:border-destructive-500' : 'border-destructive-500 after:border-destructive-500'} text-destructive-500`
    }[variant];

    const SelectInputStyle = `outline-none ${disabled ? "cursor-not-allowed" : ""}`;
    const SelectInputVariant = {
        default: "placeholder:text-gray-400 text-black",
        error: "placeholder:text-destructive-500 text-destructive-500"
    }[variant];


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        if (!isSelected) {
            setIsSelected(true);
        }
    };

    const handleRemoveItem = (value: string) => {
        context.toggleValue(value);
    };


    return (
        <div
            onClick={() => disabled ? null : setIsSelected(!isSelected)}
            className={cn(
                selectTriggerStyle,
                SelectTriggerVariant,
                "flex flex-wrap gap-1 cursor-pointer",
                className
            )}
            {...props}
        >
            {type === "multiple" ? (
                <>
                    {selectedValue.map((value) => (
                        <div
                            key={value}
                            className="inline-flex items-center gap-1 bg-sky-100 px-2 py-1/2 rounded-xm text-black"
                        >
                            <span>{value}</span>
                            <button
                                type="button"
                                onClick={() => {handleRemoveItem(value);}}
                            >
                                <SelectCloseIcon />
                            </button>
                        </div>
                    ))}
                    <input 
                        type="text"
                        className={cn(
                            "flex-1 min-w-[50px]",
                            SelectInputStyle,
                            SelectInputVariant,
                            inputClassName
                        )}
                        placeholder={selectedValue.length === 0 ? `${placeholder}` : ""}
                        value={searchValue}
                        onChange={handleInputChange}
        
                    />
                </>
            ) : (
                <input 
                    type="text"
                    className={cn(
                        "w-full",
                        SelectInputStyle,
                        SelectInputVariant,
                        inputClassName
                    )}
                    placeholder="선택하세요."
                    value={selectedValue}
                    readOnly
                />
            )}
        </div>
    );
};

SelectTrigger.displayName = "SelectTrigger";

const SelectContent = ({
    className,
    children,
    ...props
}: React.ComponentProps<'ul'>) => { 

    const context = useContext(SelectContext);

    if(!context) {
        throw new Error("SelectContent는 Dropdown 구성 요소 내에서 사용해야 합니다. <Select.Content>가 <Select> 구성 요소 내부에 중첩되어 있는지 확인하세요.")
    }

    const { isSelected, variant, searchValue } = context;

    if (!isSelected) return null;

    const selectContentStyle = `absolute top-full mt-1 flex flex-col gap-2 z-999 bg-white rounded-xs border w-full p-2 overflow-y-auto max-h-42  
    [&::-webkit-scrollbar]:w-[6px] 
    [&::-webkit-scrollbar-track]:bg-transparent 
    [&::-webkit-scrollbar-thumb]:bg-gray-300 
    [&::-webkit-scrollbar-thumb]:rounded-full 
    hover:[&::-webkit-scrollbar-thumb]:bg-gray-300`;
    const selectContentVariant = {
        default: "border-gray-400",
        error: "border-destructive-500"
    }[variant];

    
    const filteredChildren = React.Children.toArray(children).filter((child) => {
        if (React.isValidElement(child) && searchValue) {
            const childProps = child.props as SelectItemProps;
            return childProps.children?.toString().toLowerCase().includes(searchValue.toLowerCase());
        }
        return true;
    });

    return(
        <ul
            role="listbox"
            className={cn(
                selectContentVariant,
                selectContentStyle, 
                className
            )}
            {...props}
        >
            {filteredChildren.length > 0 ? (
                filteredChildren
            ) : (
                <li className="text-gray-400 text-center py-2">
                    검색 결과가 없습니다.
                </li>
            )}
        </ul>
    )
}

SelectContent.displayName = "SelectContent";

const SelectItem = ({
    value,
    className,
    children,
    ...props
}: SelectItemProps) => {
    const context = useContext(SelectContext);
    if(!context) {
        throw new Error("SelectItem은 Select 구성 요소 내에서 사용해야 합니다. <Select.Item>이 <Select> 구성 요소 내부에 중첩되어 있는지 확인하세요.")
    }

    const { selectedValue, toggleValue, variant } = context;

    const isItemSelected = selectedValue.includes(value);
    
    const onItemChange = () => {
        toggleValue(value); 
    };

    const selectItemStyle = "text-gray-400 hover:text-black cursor-pointer";
    const selectItemVariant = {
        default: `${isItemSelected ? "text-primary-700": ""} `,
        error: `${isItemSelected ? "text-destructive-500": ""} `
    }[variant];
    
    return(
        <li
            role="option"
            aria-expended={isItemSelected}
            onClick={onItemChange}
            className={cn(
                selectItemStyle,
                selectItemVariant,
                className
            )}
            value={value}
            {...props}
        >{children}</li>
    )
}

SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectContent, SelectItem };