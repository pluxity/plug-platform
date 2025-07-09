import { forwardRef, useState } from 'react';
import { cn } from "../../../utils/utils";
import { InputProps } from "./Input.types";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, disabled, icon, type = 'text', ariaLabel, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const inputType = type === 'password' && showPassword ? 'text' : type;
    const iconColor = error ? 'fill-red-700' : disabled ? 'fill-neutral-300' : isFocused ? 'fill-slate-400' : 'fill-neutral-300';
    
    return (
      <div
        className={cn(
          "w-44 h-9 min-w-12 px-2.5 bg-white rounded-[2px]",
          "outline outline-1 outline-offset-[-1px] outline-slate-400",
          "inline-flex items-center",
          icon ? "justify-start gap-[5px]" : "justify-between",
          error && "outline-red-700",
          disabled && "bg-gray-200 outline-neutral-300",
          className
        )}
      >
        {icon === 'info' && (
          <div className="w-3.5 h-3.5 relative">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconColor}>
              <path fillRule="evenodd" clipRule="evenodd" d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM6 9.5V11.5H8V9.5H6ZM6 2.5V8H8V2.5H6Z" />
            </svg>
          </div>
        )}
        <input
          type={inputType}
          aria-label={ariaLabel}
          className={cn(
            "bg-transparent border-none outline-none w-full",
            "text-sm font-medium",
            "text-text-black",
            isFocused && "text-zinc-700",
            props.value && "text-zinc-700",
            props.defaultValue && "text-zinc-700",
            error && "text-red-700",
            disabled && "text-neutral-300",
          )}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          ref={ref}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="w-3.5 h-3.5 relative focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconColor}>
                <path d="M7 2C3.81818 2 1.10091 4.07333 0 7C1.10091 9.92667 3.81818 12 7 12C10.1818 12 12.8991 9.92667 14 7C12.8991 4.07333 10.1818 2 7 2ZM7 10.3333C5.24364 10.3333 3.81818 8.84 3.81818 7C3.81818 5.16 5.24364 3.66667 7 3.66667C8.75636 3.66667 10.1818 5.16 10.1818 7C10.1818 8.84 8.75636 10.3333 7 10.3333ZM7 5C5.94364 5 5.09091 5.89333 5.09091 7C5.09091 8.10667 5.94364 9 7 9C8.05636 9 8.90909 8.10667 8.90909 7C8.90909 5.89333 8.05636 5 7 5Z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={iconColor}>
                <path d="M7.00318 3.8263C8.76035 3.8263 10.1864 5.24104 10.1864 6.9842C10.1864 7.39472 10.1037 7.77999 9.95725 8.13999L11.8163 9.9842C12.7776 9.18841 13.5352 8.15894 14 6.9842C12.8986 4.21157 10.1801 2.24736 6.99682 2.24736C6.1055 2.24736 5.25239 2.40525 4.46294 2.68946L5.83811 4.05367C6.201 3.90841 6.58936 3.8263 7.00318 3.8263ZM0.636653 2.10209L2.08822 3.54209L2.38108 3.83262C1.32424 4.64736 0.496589 5.73367 0 6.9842C1.10141 9.75683 3.81992 11.721 7.00318 11.721C7.99 11.721 8.93224 11.5316 9.79172 11.1905L10.0591 11.4558L11.9245 13.3L12.7331 12.4979L1.4452 1.29999L0.636653 2.10209ZM4.15734 5.59472L5.14416 6.57367C5.11232 6.7063 5.09322 6.84525 5.09322 6.9842C5.09322 8.03262 5.94634 8.87893 7.00318 8.87893C7.14325 8.87893 7.28331 8.85999 7.41701 8.82841L8.40382 9.80736C7.97726 10.0158 7.50614 10.1421 7.00318 10.1421C5.24602 10.1421 3.81992 8.72736 3.81992 6.9842C3.81992 6.48525 3.94725 6.01788 4.15734 5.59472ZM6.90132 5.10209L8.90678 7.09157L8.91951 6.99051C8.91951 5.94209 8.06639 5.09578 7.00955 5.09578L6.90132 5.10209Z" />
              </svg>
            )}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };