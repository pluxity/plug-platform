import * as React from "react";
import { cn } from "../../utils/classname";

export interface InputTextProps extends React.ComponentProps<'input'>{
    variant? : 'text' | 'outline' ;
    type?: string;
    invalid?: boolean;
    className?: string;
}

const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(({ 
    variant = 'text',
    type, 
    invalid = false,
    className, 
    ...props }, ref) => {

    const InputTextStyle = `${invalid === true ? "enabled:placeholder:text-red-600" : "placeholder:text-gray-300 enabled:hover:placeholder:text-black focus:placeholder:text-black"} outline-none cursor-pointer text-xs text-black placeholder:text-xs disabled:text-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed`;

    const inputVariantStyle = {
        outline : `${invalid === true ? "border-red-600" : "border-gray-400"} p-2 border border-1 rounded-xs h-9 disabled:bg-gray-200`,
        text : '',
    }[variant];
    

    return (
        <>
            <input
                type={type}
                aria-invalid={invalid} 
                className={cn(
                    InputTextStyle,
                    inputVariantStyle,
                    invalid,
                    className
                )}
                ref={ref}
                {...props}
            />
        </>
        )
    }
)

  export {InputText};