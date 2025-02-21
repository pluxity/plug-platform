import { useState, HTMLAttributes } from "react";
import { cn } from "../../utils/classname";

export interface RadioProps extends HTMLAttributes<HTMLInputElement> {
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  value?: string;
  className?: string;
  disabled?: boolean;
}

const Radio = ({
  variant = "primary",
  size = "small",
  disabled = false,
  value,
  children,
  className,
  ...props
}: RadioProps) => {
  // 체크박스 input 스타일
  const inputStyle =
    "inline-block border-1 rounded-full relative after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:w-1/2 after:h-1/2 after:rounded-full after:bg-white after:border-full after:transform";

  const inputSizeStyle = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  }[size];

  const inputVariantStyle = {
    primary: "bg-white border-black after:border-black",
    secondary: "bg-white border-secondary-500 after:border-black",
  }[variant];

  const inputRadioStyle = {
    primary: "bg-primary-500 border-primary-500",
    secondary: "bg-secondary-500 border-secondary-500",
  }[variant];

  const inputDisabledStyle = disabled
    ? "bg-gray-200 border-gray-300 cursor-not-allowed"
    : "";

  // 체크박스 label 스타일
  const labelStyle = "cursor-pointer inline-flex gap-x-1 items-center";
  const labelSizeStyle = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[size];

  const labelVariantStyle = {
    primary: "text-black",
    secondary: "text-secondary-500",
  }[variant];

  const labelDisabledStyle = disabled ? "text-gray-400" : "";

  // 체크박스 동작
  const [checked, setChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <label
      role="radio"
      aria-checked={checked}
      htmlFor={value}
      className={cn(
        labelStyle,
        labelSizeStyle,
        labelVariantStyle,
        labelDisabledStyle,
        className
      )}
    >
      <input
        type="radio"
        id={value}
        name="radiotest"
        className="absolute opacity-0"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
      <span
        className={cn(
          inputStyle,
          inputSizeStyle,
          inputVariantStyle,
          inputDisabledStyle,
          checked
            ? `after:block after:border-white ${inputRadioStyle}`
            : `after:hidden`,
          "transition-all duration-300"
        )}
      ></span>
      {children}
    </label>
  );
};

export default Radio;
