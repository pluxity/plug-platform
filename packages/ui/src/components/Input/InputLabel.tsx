import * as React from "react";
import { cn } from "../../utils/classname";

export interface InputLabelProps extends React.ComponentProps<'label'> {
  id?: string;
  className?: string;
}

const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(({
  children,
  id,
  className,
  ...props
}, ref) => {
  return (
    <label
      ref={ref}
      htmlFor={id}
      className={cn(
        "text-sm",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
});

InputLabel.displayName = 'InputLabel';

export { InputLabel };