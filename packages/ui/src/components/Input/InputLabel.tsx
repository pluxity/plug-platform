import { cn } from "../../utils/classname";

const InputLabel = ({
  children,
  id,
  className,
  ref,
  ...props
}: React.ComponentProps<'label'>) => {
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
};

InputLabel.displayName = 'InputLabel';

export { InputLabel };