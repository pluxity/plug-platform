import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/classname";
import type { CheckboxProps } from "./Checkbox.types";

const Checkbox = ({
  color = "primary",
  size = "small",
  type = "rectangle",
  label,
  disabled = false,
  checked,
  onChange,
  indeterminate = false,
  inputClassName,
  className,
  ref,
  ...props
}: CheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  useEffect(() => {
    if(inputRef.current){
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  // 체크박스 input 스타일
  const inputStyle = `inline-block cursor-pointer bg-white border-1 border-gray-500 relative after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] 
  ${indeterminate ? "after:w-1/2 after:h-[2px] after:bg-white" : "after:-translate-y-2/3 after:w-1/2 after:h-1/3 after:border-t-1 after:border-r-1 after:border-white after:rotate-132"}`;

  const inputTypeStyle = {
    rectangle: "rounded-sm",
    circle: "rounded-full",
  }[type];

  const inputSizeStyle = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  }[size];


  const inputColorStyle = {
    primary: `${checked ? "bg-primary-500 border-primary-600" : ""}`,
    secondary: `${checked ? "bg-secondary-500 border-secondary-600" : ""}`,
  }[color];

  const inputDisabledStyle = disabled ? "bg-gray-200 border-gray-400 after:border-gray-400 cursor-not-allowed" : "";

  // 체크박스 label 스타일
  const labelStyle = "cursor-pointer inline-flex gap-x-1 items-center";
  const labelSizeStyle = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[size];

  const labelColorStyle = {
    primary: "text-black",
    secondary: "text-black",
  }[color];

  const labelDisabledStyle = disabled ? "text-gray-400 cursor-not-allowed" : "";

  return (
    <label
      className={cn(
        labelStyle,
        labelSizeStyle,
        labelColorStyle,
        labelDisabledStyle,
        className
      )}
    >
      <input
        type="checkbox"
        className="absolute opacity-0"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        ref={inputRef}
        {...props}
      />
      <span
        className={cn(
          inputStyle,
          inputTypeStyle,
          inputSizeStyle,
          inputColorStyle,
          inputDisabledStyle,
          checked ? `after:block` : "after:hidden", "transition-all duration-300",
          inputClassName,
        )}
        ></span>
        {label}
    </label>
  );
};

Checkbox.displayname = 'Checkbox';
export { Checkbox };
