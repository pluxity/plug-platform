import * as React from "react";
import { useState } from "react";
import { cn } from "../../utils/classname";
import type { SwitchProps } from "./Switch.types";

const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(
({
    size = 'small',
    color = 'primary',
    label,
    disabled = false,
    defaultChecked = false,
    onChange,
    checked,
    className,
    ...props
}, ref) => {

    const [switchChecked, setSwitchChecked] = useState(defaultChecked);

    const isControlled = checked !== undefined;
    const currentChecked = isControlled ? checked : switchChecked;
  
    const switchHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (!isControlled) {
        setSwitchChecked(newChecked);
      }
      onChange && onChange(newChecked);
    };

    const switchLabelStyle = "inline-flex items-center cursor-pointer gap-1";
    const switchLabelText = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
    }[size];

    const switchInputWrap = "appearance-none relative border border-gray-600 rounded-full";
    const switchInputSize = {
        small: "w-7 h-4 before:w-3 before:h-3",
        medium: "w-9 h-5 before:w-4 before:h-4",
        large: "w-11 h-6 before:w-5 before:h-5",
    }[size];
    const switchInputColor = {
        primary: "checked:bg-primary-500 checked:border-primary-600",
        secondary: "checked:bg-secondary-500 checked:border-secondary-600",
    }[color];

    const switchButtonStyle = "before:content-[''] before:absolute before:rounded-full before:left-[1px] before:top-[50%] before:transform before:-translate-y-1/2 before:bg-gray-600 before:transition-transform before:duration-300 before:ease-in-out"
    const switchStateStyle = `${currentChecked 
        ? "checked:before:bg-white disabled:border-gray-400 disabled:bg-gray-300 transition-all duration-300 ease-in-out before:transition-transform before:duration-300 before:ease-in-out" 
        : "disabled:opacity-50 transition-all duration-300 ease-in-out before:transition-transform before:duration-300 before:ease-in-out"} disabled:cursor-not-allowed checked:before:translate-x-full`;

    return(
        <label
            ref={ref}
            className={cn(
                switchLabelStyle,
            )}
        >
            <input 
                onChange={switchHandle}
                role="switch" 
                type="checkbox"
                checked={currentChecked}
                aria-checked={currentChecked}
                disabled={disabled}
                aria-disabled={disabled}
                className={cn(
                    switchInputWrap,
                    switchInputSize,
                    switchInputColor,
                    switchButtonStyle,
                    switchStateStyle,
                    className
                )}
                {...props}
            />
            {label && (
                <span 
                    className={cn(switchLabelText, `${disabled ? "text-gray-400 cursor-not-allowed" : "text-black"}`)}
                >{label}</span>
            )}
            
        </label>
    )
})

Switch.displayName = "Switch";
export { Switch };