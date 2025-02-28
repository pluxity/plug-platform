import * as React from "react"
import { cn } from "../../utils/classname";

interface TextareaProps extends React.ComponentProps<"textarea">{
    resize?: 'both' | 'horizontal' | 'vertical' | 'none';
    invalid?: boolean;
    className?: string;
}
 
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ 
    resize = 'none',
    invalid = false,
    className, 
    ...props }, ref) => {

    const textareaStyle = `${invalid === true ? "border-red-600 enabled:placeholder:text-red-600" : " border-gray-400 placeholder:text-gray-300 enabled:hover:placeholder:text-black focus:placeholder:text-black"} outline-none cursor-pointer text-xs text-black placeholder:text-xs disabled:text-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed p-2 border border-1 rounded-xs h-9 disabled:bg-gray-200 min-w-55 min-h-20`;
    const resizeStyles = {
      both: "resize",
      horizontal: "resize-x",
      vertical: "resize-y",
      none: "resize-none",
    }[resize];

  return (
    <textarea
      className={cn(
        textareaStyle,
        resizeStyles,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
 
export { Textarea }