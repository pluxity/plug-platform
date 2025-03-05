import * as React from "react";
import {InputText} from "./InputText";
import { cn } from "../../utils/classname";

export interface InputIconProps extends React.ComponentProps<'div'> {
    position?: 'left' | 'right';
    disabled?: boolean;
}

const InputIcon = React.forwardRef<HTMLDivElement, InputIconProps>(({
    position = 'left',
    disabled = false,
    className,
    ...props
  }, ref) => {

    const InputIconStyle = "inline-flex items-center gap-2 p-2 border border-1 rounded-xs h-9";

    return (
      <div 
        className={cn(
            InputIconStyle,
            className,
        )} 
        ref={ref}
        {...props}
      >
        {position === 'left' && (<div>icon</div>)}

        <InputText 

            disabled={disabled}
        />

        {position === 'right' && (<div>icon</div>)}
        
      </div>
    );
  });

export {InputIcon};


