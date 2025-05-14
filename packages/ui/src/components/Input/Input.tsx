import * as React from "react";
import { useState } from "react";
import { cn } from "../../utils/classname";
import { InputProps } from "./Input.types";

const Input = React.forwardRef<HTMLInputElement, InputProps<string>>((props, ref) => {
        const {
        id,
        ariaLabel,
        type = "text",
        invalid = false,
        iconPosition = "leading",
        iconSvg,
        renderIcon,
        value,
        onChange,
        required,
        className,
        disabled,
        ...rest
    } = props;

    const [inputFocus, setInputFocus] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange?.(newValue);
    };

    const iconColor = invalid
        ? "red"
        : disabled
            ? "lightgray"
            : inputFocus
                ? "black"
                : "lightgray";

    const inputWrapStyle = `${invalid ? "border-red-600" : disabled ? "border-gray-300 bg-gray-200" : "border-gray-400"} inline-flex items-center border border-1 rounded-xs h-9`;

    const InputTextStyle = `${invalid ? "enabled:placeholder:text-red-600 text-red-600" : "placeholder:text-gray-300 focus:placeholder:text-black text-black"} outline-none text-xs placeholder:text-xs h-full w-full p-2 disabled:text-gray-300 disabled:cursor-not-allowed`;

    const defaultIcon = (position: "leading" | "trailing") => {
        if (iconSvg) {
            const IconSvg = iconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
            return (
                <span className={position === "leading" ? "pl-2" : "pr-2"}>
          <IconSvg fill={iconColor} />
        </span>
            );
        }
        return null;
    };

    const componentIcon = (position: "leading" | "trailing") => {
        if (renderIcon) {
            return renderIcon({ iconColor, isFocused: inputFocus });
        }
        return defaultIcon(position);
    };

    return (
        <div className={cn(inputWrapStyle)}>
            {iconPosition === "leading" && componentIcon("leading")}
            <input
                id={id}
                ref={ref}
                type={type}
                value={value}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                onChange={handleChange}
                aria-describedby={id}
                aria-label={ariaLabel}
                required={required}
                disabled={disabled}
                className={cn(InputTextStyle, className)}
                {...rest}
            />
            {iconPosition === "trailing" && componentIcon("trailing")}
        </div>
    );
});

Input.displayName = "Input";

export { Input };
