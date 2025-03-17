import * as React from "react";
import { cn } from "../../utils/classname";
import type { LabelProps } from "./Label.types";

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
({
    htmlFor,
    className,
    children,
}, ref) => {


    return(
        <label 
            ref={ref}
            htmlFor={htmlFor}
            className={cn(" ", className)}
        >
         {children}   
        </label>
    )
})

Label.displayName = "Label";
export { Label };