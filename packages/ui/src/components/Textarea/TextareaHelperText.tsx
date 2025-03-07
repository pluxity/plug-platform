import * as React from "react";
import { cn } from "../../utils/classname";

export interface TextareaHelperTextProps extends React.ComponentProps<'p'> {
  id?: string;
  error?: boolean;
  className?: string;
}

const TextareaHelperText = React.forwardRef<HTMLParagraphElement, TextareaHelperTextProps>(({
  children,
  id,
  error = false,
  className,
  ...props
}, ref) => {

  const helperTextStyle = "text-xs";
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

TextareaHelperText.displayName = 'TextareaHelperText';

export { TextareaHelperText }; 