import { useState, HTMLAttributes } from "react";
import { cn } from "../../utils/classname";

export interface CheckboxProps extends HTMLAttributes<HTMLInputElement> {
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  type?: "rectangle" | "circle";
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Checkbox = ({
  variant = "primary",
  size = "small",
  type = "rectangle",
  label,
  disabled = false,
  className,
  ...props
}: CheckboxProps) => {

  // 체크박스 동작
  const [checked, setChecked] = useState(false);

  // 체크박스 input 스타일
  const inputStyle = "inline-block cursor-pointer bg-white border-1 border-gray-500 relative after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-2/3 after:w-1/2 after:h-1/3 after:border-t-1 after:border-r-1 after:border-white after:transform after:rotate-132";

  const inputTypeStyle = {
    rectangle: "rounded-sm",
    circle: "rounded-full",
  }[type];

  const inputSizeStyle = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  }[size];


  const inputVariantStyle = {
    primary: `${checked ? "bg-primary-500 border-primary-600" : ""}`,
    secondary: `${checked ? "bg-secondary-500 border-secondary-600" : ""}`,
  }[variant];

  const inputDisabledStyle = disabled ? "bg-gray-200 border-gray-400 after:border-gray-400 cursor-not-allowed" : "";

  // 체크박스 label 스타일
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <label
      role="checkbox"
      aria-checked={checked}
      htmlFor="checkbox"
      className={cn(
        labelStyle,
        labelSizeStyle,
        labelVariantStyle,
        labelDisabledStyle,
        className
      )}
    >
      <input
        type="checkbox"
        id="checkbox"
        className="absolute opacity-0"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        {...props}
      />
      <span
        className={cn(
          inputStyle,
          inputTypeStyle,
          inputSizeStyle,
          inputVariantStyle,
          inputDisabledStyle,
          checked ? `after:block` : "after:hidden", "transition-all duration-300"
        )}
        ></span>
        {label}
    </label>
  );
};

export default Checkbox;
