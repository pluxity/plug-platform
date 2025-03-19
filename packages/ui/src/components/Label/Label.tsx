import * as React from "react";
import { cn } from "../../utils/classname";
import type { LabelProps } from "./Label.types";

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
({
    color = "primary",
    required,
    size = "medium",
    className,
    children,
    ...props
}, ref) => {

    const labelColor = {
        primary: "text-primary-500",
        secondary: "text-secondary-500",
        destructive: "text-destructive-500"
    }[color];
    

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
                `${required && "before:align-middle before:content-['*'] before:mr-[3px] before:text-red-600 font-bold"}`,
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