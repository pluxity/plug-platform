import * as React from "react";
import { cn } from "../../utils/classname";
import type { LabelProps } from "./Label.types";

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
({
    error,
    disabled,
    focused,
    required,
    size = "medium",
    className,
    children,
    ...props
}, ref) => {

    const labelColor = `text-black 
    ${error && "text-red-600"} 
    ${disabled && "text-gray-400 cursor-not-allowed"}
    ${focused && "text-blue-600"}
    ${required && "before:align-middle before:content-['*'] before:mr-[3px] before:text-red-600"}`;

    const labelSize = {
        small: "text-sm ", 
        medium: "text-base",
        large: "text-lg"
    }[size];


    return(
        <label 
            ref={ref}
            className={cn(
                labelSize,
                labelColor,
                className
            )}
            {...props}
        >
         {children}   
        </label>
    )
})

Label.displayName = "Label";
export { Label };