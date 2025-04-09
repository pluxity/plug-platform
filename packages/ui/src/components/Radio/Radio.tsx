import { createContext, useContext, useState } from "react";
import { cn } from "../../utils/classname";
import type { RadioGroupProps, RadioGroupItemProps } from "./Radio.types";

interface RadioGroupContextProps {
  color: string;
  size: string;
  name: string;
  disabled?: boolean;
}
const RadioGroupContext = createContext<RadioGroupContextProps | undefined>(undefined);

const RadioGroup = ({
  defaultValue = "",
  color = "primary",
  size = "small",
  name,
  disabled,
  children,
  ref,
  ...props
}: RadioGroupProps) => {
  
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (value: string) => {
    setSelectedValue(value);
  }

  return (
    <RadioGroupContext.Provider value={{ color, size, name, disabled }}>
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
  className,
  ref,
  ...props
}: RadioGroupItemProps) => {

  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem은 RadioGroup 내에서 사용되어야 합니다.");
  }

  const { color, size, name, disabled } = context;

  const inputStyle = "z-1 inline-block cursor-pointer border-1 bg-white border-gray-500 rounded-full relative after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border-full after:transform";

  const inputSizeStyle = {
    small: "w-4 h-4 after:w-3 after:h-3",
    medium: "w-5 h-5 after:w-4 after:h-4",
    large: "w-6 h-6 after:w-5 after:h-5",
  }[size];

  // const inputColorStyle = {
  //     primary: `${selectedValue === value ? "border-primary-500 after:bg-primary-500" : ""}`,
  //     secondary: `${selectedValue === value ? "border-secondary-500 after:bg-secondary-500" : ""}`,
  // }[color];

  // const inputDisabledStyle = disabled ? `bg-gray-200 border-gray-400 cursor-not-allowed ${selectedValue === value ? "after:bg-gray-400" : ""}` : "";

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
        name={name}
        value={value}
      />
      <span
        className={cn(
          inputStyle,
          inputSizeStyle,
          // inputColorStyle,
          // inputDisabledStyle,
          // selectedValue === value ? "after:block" : "after:hidden"
        )}
      ></span>
      {label}
    </label>
  );
};

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
