import { useState, createContext, useContext } from "react";
import { cn } from "../../utils/classname";
import type { RadioGroupProps, RadioItemProps } from "./Radio.types";

interface RadioGroupContextProps {
  selectedValue: string | null;
  onChange: (value: string) => void;
  color: string;
  size: string;
  name: string;
}
const RadioGroupContext = createContext<RadioGroupContextProps | undefined>(undefined);

const RadioGroup = ({
  defaultValue,
  color = "primary",
  size = "small",
  onChange,
  name,
  children,
  ref,
  ...props
}: RadioGroupProps) => {

  const [internalValue, setInternalValue] = useState<string | null>(defaultValue || null);

  const handleChange = (value: string) => {
    setInternalValue(value);
    onChange(value);
  };

  return (
    <RadioGroupContext.Provider value={{ selectedValue: internalValue, onChange: handleChange, color, size, name }}>
      <div 
          role="radiogroup" 
          className={cn("grid gap-2", props.className)} 
          ref={ref} 
          {...props}
        >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}; 

RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = ({
  value,
  label,
  disabled = false,
  className,
  ref,
  ...props
}: RadioItemProps) => {

  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem은 RadioGroup 내에서 사용되어야 합니다.");
  }

  const { selectedValue, onChange, color, size, name } = context;

  const inputStyle = "z-1 inline-block cursor-pointer border-1 bg-white border-gray-500 rounded-full relative after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border-full after:transform";

  const inputSizeStyle = {
    small: "w-4 h-4 after:w-3 after:h-3",
    medium: "w-5 h-5 after:w-4 after:h-4",
    large: "w-6 h-6 after:w-5 after:h-5",
  }[size];

  const inputVariantStyle = {
      primary: `${selectedValue === value ? "border-primary-500 after:bg-primary-500" : ""}`,
      secondary: `${selectedValue === value ? "border-secondary-500 after:bg-secondary-500" : ""}`,
  }[color];

  const inputDisabledStyle = disabled ? `bg-gray-200 border-gray-400 cursor-not-allowed ${selectedValue === value ? "after:bg-gray-400" : ""}` : "";

  const labelStyle = "cursor-pointer inline-flex gap-x-1 items-center";
  const labelSizeStyle = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[size];

  const labelVariantStyle = {
    primary: "text-black",
    secondary: "text-black",
  }[color];

  const labelDisabledStyle = disabled ? "text-gray-400 cursor-not-allowed" : "";

  const handleChange = () => {
    if (onChange && value) {
      onChange(value);
    }
  };

  return (
    <label
      className={cn(
        labelStyle,
        labelSizeStyle,
        labelVariantStyle,
        labelDisabledStyle,
        className
      )}
      {...props}
    >
      <input
        ref={ref}
        type="radio"
        className="absolute opacity-0 z-1"
        disabled={disabled}
        checked={selectedValue === value}
        onChange={handleChange}
        name={name}
        value={value}
      />
      <span
        className={cn(
          inputStyle,
          inputSizeStyle,
          inputVariantStyle,
          inputDisabledStyle,
          selectedValue === value ? "after:block" : "after:hidden"
        )}
      ></span>
      {label}
    </label>
  );
};

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
