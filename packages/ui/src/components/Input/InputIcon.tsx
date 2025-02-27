import * as React from "react";
import {InputText} from "./InputText";
import { cn } from "../../utils/classname";

export interface InputIconProps extends React.ComponentProps<'div'> {
    type?: 'password' | 'text';
    position?: 'left' | 'right';
    placeholder?: string;
    invalid?: boolean;
    disabled?: boolean;
    className?: string;
}

const InputIcon = React.forwardRef<HTMLDivElement, InputIconProps>(({
    type = 'password',
    position = 'left',
    placeholder,
    invalid = false,
    disabled = false,
    className,
    ...props
  }, ref) => {

    const InputIconStyle = "inline-flex items-center gap-2 p-2 border border-1 rounded-xs h-9";
    const invalidStyle = invalid === true ? 'border-red-600' : 'border-gray-400';
    const disabledStyle = disabled === true ? 'cursor-not-allowed text-gray-300 border-gray-300 bg-gray-200' : '';

    return (
      <div 
        className={cn(
            InputIconStyle,
            invalidStyle,
            disabledStyle,
            className,
        )} 
        ref={ref}
        {...props}
      >
        {position === 'left' && (<div>icon</div>)}

        <InputText 
            type={type}
            placeholder={placeholder} 
            invalid={invalid}
            disabled={disabled}
        />

        {position === 'right' && (<div>icon</div>)}
        
      </div>
    );
  });

export {InputIcon};


