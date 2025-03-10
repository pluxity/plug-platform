import * as React from "react";
import { cn } from "../../utils/classname";

export interface InputHelperTextProps extends React.ComponentProps<'p'> {
  id?: string;
  error?: boolean;
  className?: string;
}

const InputHelperText = React.forwardRef<HTMLParagraphElement, InputHelperTextProps>(({
  children,
  id,
  error = false,
  className,
  ...props
}, ref) => {

  const helperTextStyle = "text-xs my-1";
  const helperTextError = error ? "text-red-600" : "text-gray-500";

  return (
    <p
      ref={ref}
      id={id}
      className={cn(
        helperTextStyle,
        helperTextError,
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});

InputHelperText.displayName = 'InputHelperText';

export { InputHelperText }; 