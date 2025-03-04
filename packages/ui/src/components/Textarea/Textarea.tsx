import * as React from "react";
import { useState } from "react";
import { cn } from "../../utils/classname";

interface TextareaProps extends React.ComponentProps<"textarea">{
    helperControl?: boolean;
    helperText?: string;
    ariaLabel?: string;
    resize?: 'both' | 'horizontal' | 'vertical' | 'none';
    invalid?: boolean;
    className?: string;
}
 
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ 
    helperControl = false,
    helperText,
    ariaLabel,
    resize = 'none',
    invalid = false,
    className, 
    ...props }, ref) => {

    const [textareaValue, setTextareaValue] = useState<string>("");

    const textareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextareaValue(e.target.value);
    }

    
    const textareaStyle = `${invalid ? "border-red-600 enabled:placeholder:text-red-600 text-red-600" : " border-gray-400 placeholder:text-gray-300 enabled:hover:placeholder:text-black focus:placeholder:text-black text-black"} outline-none cursor-pointer text-xs placeholder:text-xs disabled:text-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed p-2 border border-1 rounded-xs h-9 disabled:bg-gray-200 min-w-55 min-h-20`;
    const resizeStyles = {
      both: "resize",
      horizontal: "resize-x",
      vertical: "resize-y",
      none: "resize-none",
    }[resize];
    
    const helperTextStyle = "text-xs"
    const helperTextId = props.id;

  return (
    <>
      <textarea
        aria-describedby={helperTextId}
        aria-label={ariaLabel}
        aria-invalid={invalid} 
        className={cn(
          textareaStyle,
          resizeStyles,
          className
        )}
        value={textareaValue}
        onChange={textareaChange}
        ref={ref}
        {...props}
      />
      {helperControl && 
      <p
        id={helperTextId}
        className={helperTextStyle}
      >
        {helperText || ""}
      </p>
      }
    </>
  )
})

 
export { Textarea }