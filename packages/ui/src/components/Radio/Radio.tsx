import * as React from "react";
import { useState, createContext, useContext, ReactNode} from "react";
import { cn } from "../../utils/classname";

interface RadioGroupContextProps {
  selectedValue: string | null;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextProps | undefined>(undefined);

interface RadioGroupProps {
  value?: string; 
  defaultValue?: string; 
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>((
  { value, defaultValue, onChange, children, ...props },
  ref
) => {
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue || null);
  const selectedValue = value !== undefined ? value : internalValue;


  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
    if (value === undefined) {
      setInternalValue(newValue);
    }
  };

  return (
    <RadioGroupContext.Provider value={{ selectedValue, onChange: handleChange }}>
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


// RadioGroupItem 컴포넌트
export interface RadioItemProps extends React.HTMLAttributes<HTMLLabelElement> {
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  name?: string;
  value?: string;
  label?:string;
  disabled?: boolean;
  className?: string;
  onChange?: () => void;
}

const RadioGroupItem = React.forwardRef<HTMLLabelElement, RadioItemProps>(
  ({
    variant = "primary",
    size = "small",
    label,
    name,
    value,
    disabled = false,
    children,
    className,
    ...props
  }, ref) => {

    // 라디오버튼 input 스타일
    const inputStyle =
      "z- inline-block border-1 rounded-full relative after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:w-1/2 after:h-1/2 after:rounded-full after:bg-white after:border-full after:transform";

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

    const inputDisabledStyle = disabled
      ? "bg-gray-200 border-gray-300 cursor-not-allowed"
      : "";

    // 라디오버튼 label 스타일
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

    const labelDisabledStyle = disabled ? "text-gray-400" : "";

    const context = useContext(RadioGroupContext);
    if (!context) {
        throw new Error('RadioGroupItem은 RadioGroup 내부에서만 사용해야 합니다.');
    }
    const { selectedValue, onChange } = context;

    const handleChange = () => {
        if (onChange && value) {
            onChange(value);
        }
    };

    return (
      <label
        aria-checked={selectedValue === value}
        htmlFor={value}
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
          id={value}
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
        {children}
      </label>
    );
  }
);

RadioGroupItem.displayName = "RadioGroupItem";
RadioGroup.displayName = "RadioGroup";

export { RadioGroup, RadioGroupItem };
