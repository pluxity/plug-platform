import * as React from "react";
import { cn } from "../../utils/classname";

export interface TextareaProps extends React.ComponentProps<'textarea'> {
    ariaLabel?: string;
    resize?: "none" | "both" | "horizontal" | "vertical";
    invalid?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
    ariaLabel,
    resize = "none",
    invalid = false,
    value,
    onChange,
    className, 
    ...props }, ref) => {
      
    const textareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
    };

    const textareaStyle = `${invalid ? "border-red-600 enabled:placeholder:text-red-600 text-red-600" : " border-gray-400 placeholder:text-gray-300 focus:placeholder:text-black text-black"} outline-none text-xs placeholder:text-xs disabled:text-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed p-2 border border-1 rounded-xs h-9 disabled:bg-gray-200 min-w-55 min-h-20`;
    const resizeStyles = {
      both: "resize",
      horizontal: "resize-x",
      vertical: "resize-y",
      none: "resize-none",
    }[resize];

  return (
    <>
      <textarea
        aria-label={ariaLabel}
        aria-invalid={invalid} 
        className={cn(
          textareaStyle,
          resizeStyles,
          className
        )}
        value={value}
        onChange={textareaChange}
        ref={ref}
        {...props}
      />
    </>
  )
})

Textarea.displayName = 'Textarea';

export { Textarea }