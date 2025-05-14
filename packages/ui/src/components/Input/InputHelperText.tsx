import { cn } from "../../utils/classname";
import { InputHelperTextProps } from "./Input.types";

const InputHelperText = ({
  children,
  id,
  error = false,
  className,
  ref,
  ...props
}: InputHelperTextProps) => {

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
};

InputHelperText.displayName = 'InputHelperText';

export { InputHelperText }; 