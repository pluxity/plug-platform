import React, { createContext, useState, useContext } from "react";
import { cn } from "../../utils/classname";
import type { 
    ComboBoxProps,
    ComboBoxTriggerProps,
    ComboBoxContentProps,
    ComboBoxItemProps,
 } from "./ComboBox.types";


interface ComboBoxContextProps{
    disabled: boolean;
    isSelected: boolean;
    setIsSelected: (value: boolean) => void;
    selectedValue: string;
    toggleValue: (value: string) => void;
    inputValue: string;
    setInputValue: (value: string) => void;
}

const ComboBoxContext = createContext<ComboBoxContextProps | undefined>(undefined);

const ComboBox = ({
    disabled = false,
    selected,
    onChange,
    className,
    children,
    ...props
}: ComboBoxProps) => {

    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [inputValue, setInputValue] = useState("");
    
    const isControlled = selected !== undefined;
    const currentSelected = isControlled ? selected : selectedValue;

    const toggleValue = (value: string) => {
        if (!isControlled) {
          setSelectedValue(value);
        }
        if (onChange) {
          onChange(value);
        }
        setIsSelectOpen(false);
      };

    return(
        <ComboBoxContext.Provider value={{ isSelected:isSelectOpen, setIsSelected:setIsSelectOpen, toggleValue, selectedValue:currentSelected, disabled, inputValue, setInputValue }}>
            <div
                role="combobox"
                aria-expanded={isSelectOpen}
                aria-haspopup="listbox"
                className={cn(
                    "relative inline-block",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </ComboBoxContext.Provider>
    )
}

ComboBox.displayName = "ComboBox";

const ComboBoxTrigger = ({
    placeholder = "입력하세요.",
    inputClassName,
    className,
    ...props
}: ComboBoxTriggerProps) => {
    const context = useContext(ComboBoxContext);

    if (!context) {
      throw new Error("ComboBoxTrigger ComboBox 구성 요소 내에서 사용해야 합니다. <ComboBox.Trigger>이 <ComboBox> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }
  
    const { isSelected, setIsSelected, selectedValue, disabled } = context;

    const comboBoxTriggerStyle = `flex items-center p-1 border border-1 border-gray-400 bg-white text-left relative after:absolute after:content-[''] after:border-t-1 after:border-r-1 after:top-1/2 after:right-3 after:transform after:rotate-135 after:translate-y-[-50%] after:w-2 after:h-2 transition-all duration-300 w-full rounded-xs pr-6
    ${disabled ? "cursor-not-allowed bg-gray-200" : ""} ${isSelected ? 'after:border-black' : 'after:border-gray-400'}`;

    const comboBoxInputStyle = `outline-none ${disabled ? "cursor-not-allowed" : ""}`;

    return (
        <div
            onClick={() => disabled ? null : setIsSelected(!isSelected)}
            className={cn(
                comboBoxTriggerStyle,
                "flex flex-wrap gap-1 cursor-pointer",
                className
            )}
            {...props}
        >
            {<input 
                    type="text"
                    className={cn(
                        "w-full",
                        comboBoxInputStyle,
                        inputClassName,
                    )}
                    placeholder={placeholder}
                    value={selectedValue}
                    readOnly
                />}
        </div>
    );
};

ComboBoxTrigger.displayName = "ComboBoxTrigger";

const ComboBoxContent = ({
    inputClassName,
    className,
    children,
    ...props
}: ComboBoxContentProps) => { 

    const context = useContext(ComboBoxContext);

    if(!context) {
        throw new Error("ComboBoxContent는 Dropdown 구성 요소 내에서 사용해야 합니다. <ComboBox.Content>가 <ComboBox> 구성 요소 내부에 중첩되어 있는지 확인하세요.")
    }

    const { isSelected, inputValue, setInputValue } = context;

    if (!isSelected) return null;

    const comboBoxContentStyle = `absolute top-full mt-1 flex flex-col gap-2 z-999 bg-white rounded-xs border w-full p-2 overflow-y-auto max-h-42 border-gray-400 
    [&::-webkit-scrollbar]:w-[6px] 
    [&::-webkit-scrollbar-track]:bg-transparent 
    [&::-webkit-scrollbar-thumb]:bg-gray-300 
    [&::-webkit-scrollbar-thumb]:rounded-full 
    hover:[&::-webkit-scrollbar-thumb]:bg-gray-300`;

   const filteredChildren = React.Children.toArray(children).filter((child) => {
        if (React.isValidElement(child) && inputValue) {
            const childProps = child.props as ComboBoxItemProps;
            return childProps.children?.toString().toLowerCase().includes(inputValue.toLowerCase());
        }
        return true;
    });

    return(
        <ul
            role="listbox"
            className={cn(
                comboBoxContentStyle, 
                className
            )}
            {...props}
        >
        <li>
                <input 
                    type="text"
                    className={cn(inputClassName, "w-full outline-none")}
                    placeholder="입력하세요."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </li>

            {filteredChildren.length > 0 ? (
                filteredChildren
            ) : (
                <li className="text-gray-400 px-2">
                    검색 결과가 없습니다.
                </li>
            )}
        </ul>
    )
}

ComboBoxContent.displayName = "ComboBoxContent";

const ComboBoxItem = ({
    value,
    className,
    children,
    ...props
}: ComboBoxItemProps) => {
    const context = useContext(ComboBoxContext);
    if(!context) {
        throw new Error("ComboBoxItem은 ComboBox 구성 요소 내에서 사용해야 합니다. <ComboBox.Item>이 <ComboBox> 구성 요소 내부에 중첩되어 있는지 확인하세요.")
    }

    const { selectedValue, toggleValue } = context;

    const isItemSelected = selectedValue.includes(value);

    const onItemChange = () => {
        toggleValue(value);          
      };

    const comboBoxItemStyle = `text-gray-400 hover:text-black cursor-pointer
      ${isItemSelected ? "text-primary-500" : "text-gray-400"}`;
    
    return(
        <li
            role="option"
            aria-selected={isItemSelected}
            value={value}
            onClick={onItemChange}
            className={cn(
                comboBoxItemStyle,
                className
            )}
            {...props}
        >{children}</li>
    )
}

ComboBoxItem.displayName = "ComboBoxItem";

export { ComboBox, ComboBoxTrigger, ComboBoxContent, ComboBoxItem };