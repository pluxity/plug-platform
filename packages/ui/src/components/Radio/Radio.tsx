import * as React from "react";
import { useState, createContext, useContext, ReactNode } from "react";
import { cn } from "../../utils/classname";

interface RadioGroupContextProps {
  selectedValue: string | null;
  onChange: (value: string) => void;
  variant: "primary" | "secondary";
  size: "small" | "medium" | "large";
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextProps | undefined>(undefined);

interface RadioGroupProps {
  defaultValue?: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  name:string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(({
  defaultValue,
  variant = "primary",
  size = "small",
  onChange,
  name,
  children,
  ...props
}, ref) => {

  const [internalValue, setInternalValue] = useState<string | null>(defaultValue || null);

  const handleChange = (value: string) => {
    setInternalValue(value);
    onChange(value);
  };

  return (
    <RadioGroupContext.Provider value={{ selectedValue: internalValue, onChange: handleChange, variant, size, name }}>
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
});

export interface RadioItemProps extends React.HTMLAttributes<HTMLLabelElement> {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const RadioGroupItem = React.forwardRef<HTMLLabelElement, RadioItemProps>(({
  value,
  label,
  disabled = false,
  children,
  className,
  ...props
}, ref) => {

  
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem은 RadioGroup 내에서 사용되어야 합니다.");
  }

  const { selectedValue, onChange, variant, size, name } = context;

  const inputStyle = "z-1 inline-block cursor-pointer border-1 rounded-full relative after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:w-1/2 after:h-1/2 after:rounded-full after:bg-white after:border-full after:transform";

  const inputSizeStyle = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  }[size];

  const inputVariantStyle = {
    primary: "bg-white border-black after:border-black",
    secondary: "bg-white border-black after:border-black",
  }[variant];

  const inputRadioStyle = {
    primary: "bg-primary-500 border-primary-500",
    secondary: "bg-secondary-500 border-secondary-500",
  }[variant];

  const inputDisabledStyle = disabled ? "bg-gray-200 border-gray-300 cursor-not-allowed" : "";

  const labelStyle = "cursor-pointer inline-flex gap-x-1 items-center";
  const labelSizeStyle = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[size];

  const labelVariantStyle = {
    primary: "text-black",
    secondary: "text-black",
  }[variant];

  const labelDisabledStyle = disabled ? "text-gray-400 cursor-not-allowed" : "";

  const handleChange = () => {
    console.log("RadioGroupItem clicked with value:", value);
    if (onChange && value) {
      onChange(value);
    }
  };

  return (
    <label
      aria-checked={selectedValue === value}
      ref={ref}
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
          selectedValue === value
            ? `after:block after:border-white ${inputRadioStyle}`
            : `after:hidden`,
          "transition-all duration-300"
        )}
      ></span>
      {label}
    </label>
  );
});

RadioGroupItem.displayName = "RadioGroupItem";
RadioGroup.displayName = "RadioGroup";

export { RadioGroup, RadioGroupItem };
