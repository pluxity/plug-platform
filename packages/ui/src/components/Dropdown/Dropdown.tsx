import { cn } from "../../utils/classname";
import { createContext, useState, useContext } from "react";
import type { DropdownProps, DropdownItemProps } from "./Dropdown.types";

interface DropdownContextProps{
    disabled: boolean;
    variant: "default" | "error";
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
    selectedValue: string[];
    toggleValue: (value: string) => void;
}

const DropdownContext = createContext<DropdownContextProps | undefined>(undefined);

const Dropdown = ({ 
    type = "single",
    variant = "default",
    disabled = false,
    selected,
    onChange,
    className,
    children,
    ...props
}: DropdownProps) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string[]>([]);
    
    const isControlled = selected !== undefined;
    const currentPressed = isControlled ? selected : selectedValue;

    const toggleValue = (value: string) => {
        if (type === "single") {
            const newSelectedValues = [value];
            if(!isControlled) {
                setSelectedValue(newSelectedValues);
            }
            if (onChange) {
                onChange(newSelectedValues);
            }
            setIsDropdownOpen(false);
    
        } else if (type === "multiple") {
            setSelectedValue((prev) => {

                const selectedValuesSet = new Set(prev);
                
                if (selectedValuesSet.has(value)) {
                    selectedValuesSet.delete(value);
                } else {
                    selectedValuesSet.add(value);
                }
                
                const newSelectedValues = [...selectedValuesSet]; 
                if (onChange) {
                    onChange(newSelectedValues);
                }
                return newSelectedValues; 
            });

        }
    };
    

    const dropdownStyle = "relative inline-block";
    return(
        <DropdownContext value={{isSelected:isDropdownOpen, setIsSelected:setIsDropdownOpen, selectedValue:currentPressed, toggleValue, disabled, variant }}>
            <div   
                className={cn(
                    dropdownStyle,
                    className,
                )}
                {...props}
            >{children}</div>
        </DropdownContext>
    )
}


Dropdown.displayName = "Dropdown";

const DropdownTrigger = ({
    children,
    ...props
}: React.ComponentProps<'div'>) => {

    const context = useContext(DropdownContext);

    if(!context) {
        throw new Error("DropdownTrigger는 Dropdown 구성 요소 내에서 사용해야 합니다. <Dropdown.Trigger>이 <Dropdown> 구성 요소 내부에 중첩되어 있는지 확인하세요.")
    }

    const { setIsSelected, isSelected } = context;
    
    return(
        <div
            className="w-full"
            onClick={() => setIsSelected(!isSelected)}
            {...props}
        >{children}</div>
    )
}

DropdownTrigger.displayName = "DropdownTrigger";

const DropdownContent = ({
    className,
    children,
}: React.ComponentProps<'ul'>) => {

    const context = useContext(DropdownContext);
    
    if(!context) {
        throw new Error("DropdownContent는 Dropdown 구성 요소 내에서 사용해야 합니다. <Dropdown.Content>가 <Dropdown> 구성 요소 내부에 중첩되어 있는지 확인하세요.")
    }

    const { isSelected, variant, disabled } = context;

    if (!isSelected) return null;

    const dropdownContentStyle = `absolute top-full mt-1 flex flex-col gap-1 z-999 bg-white rounded-xs border w-full p-1 overflow-y-auto max-h-38 
    [&::-webkit-scrollbar]:w-[6px] 
    [&::-webkit-scrollbar-track]:bg-transparent 
    [&::-webkit-scrollbar-thumb]:bg-gray-200 
    [&::-webkit-scrollbar-thumb]:rounded-full 
    hover:[&::-webkit-scrollbar-thumb]:bg-gray-200
    ${disabled ? "bg-gray-200 cursor-not-allowed" : ""}`;

    const dropdownContentVariant = {
        default: "border-gray-300",
        error: `border-destructive-700 ${disabled ? "border-gray-200" : ""}`
    }[variant];
    
    return(
        <ul
            role="listbox"
            aria-expanded={isSelected}
            className={cn(
                dropdownContentStyle,
                dropdownContentVariant,
                className,
            )}
        >
            {children}
        </ul>
    )
}

DropdownContent.displayName = "DropdownContent";

const DropdownItem = ({
    value,
    className,
    children,
    ...props
}: DropdownItemProps) => {
    
    const context = useContext(DropdownContext);
    
    if(!context) {
        throw new Error("DropdownContent는 Dropdown 구성 요소 내에서 사용해야 합니다. <Dropdown.Content>가 <Dropdown> 구성 요소 내부에 중첩되어 있는지 확인하세요.")
    }

    const { selectedValue, toggleValue, variant, disabled } = context;
    
    const isItemSelected = selectedValue.includes(value);
    
    const onItemChange = () => {
        if(disabled) return;
        toggleValue(value); 
    };

    const dropdownItemStyle = "py-0.5 px-3 w-full hover:bg-gray-100 text-sm cursor-pointer";

    const dropdownItemVariant = {
        default: `${isItemSelected ? "text-blue-700 bg-blue-100 hover:bg-blue-100" : ""} ${disabled ? "cursor-not-allowed text-gray-400 bg-transparent hover:bg-transparent" : ""}`,
        error: `${isItemSelected ? "text-destructive-700 bg-blue-100 hover:bg-blue-100" : "text-destructive-700"} ${disabled ? "cursor-not-allowed text-gray-400 bg-transparent hover:bg-transparent" : ""}`
    }[variant];
    
    return(
        <li
            role="option"
            aria-selected={isItemSelected}
            value={value}
            onClick={onItemChange}
            className={cn(
                dropdownItemStyle,
                dropdownItemVariant,
                className
            )}
            {...props}
        >{children}</li>
    )
}

DropdownItem.displayName = "DropdownItem";
 
export { Dropdown, DropdownTrigger, DropdownContent, DropdownItem };

