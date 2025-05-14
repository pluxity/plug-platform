import * as React from 'react';
import { cn } from '../../utils/classname';
import type { ButtonProps } from './Button.types';
import {useFormContext} from "../Form/Form";

const Button = React.memo(({
      className,
      variant = 'default',
      color = 'default',
      size = 'medium',
      isLoading = false,
      disabled,
      children,
      ref,
      ...props
    }: ButtonProps) => {
    const buttonBaseStyle =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

    const variantStyles = {
      default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline:
        "border border-gray-300 bg-transparent hover:bg-gray-100",
      ghost: "bg-transparent hover:bg-gray-100",
    };

    const colorStyles = {
      default: "",
      primary:
        "bg-primary-500 text-primary-foreground shadow hover:bg-primary-600",
      destructive:
        "bg-destructive-500 text-destructive-foreground shadow-sm hover:bg-destructive-600",
      secondary:
        "bg-secondary-500 text-secondary-foreground shadow-sm hover:bg-secondary-600",
    };

    const sizeStyles = {
      small: "h-8 rounded-md px-3 text-xs",
      medium: "h-9 px-4 py-2",
      large: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    };

    const spinnerStyle =
      "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin";

    const disabledStyle = cn(
      {
        'cursor-progress': isLoading,
        'cursor-not-allowed': disabled && !isLoading,
        'cursor-pointer': !disabled && !isLoading,
        'disabled:bg-gray-200 disabled:text-gray-500': disabled || isLoading
      }
    );

    return (
      <button
        className={cn(
          buttonBaseStyle,
          variantStyles[variant],
          variant !== 'outline' && variant !== 'ghost' && colorStyles[color],
          sizeStyles[size],
          disabledStyle,
          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
         {isLoading ? (
          <>
            <span className={spinnerStyle} />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

const FormSubmitButton = React.memo(({
                              children,
                              color = 'primary',
                              size = 'medium',
                              isLoading = false,
                          }: ButtonProps) => {
    const {isValid} = useFormContext();

    return (
        <Button
            type="submit"
            color={color}
            size={size}
            disabled={!isValid}
            isLoading={isLoading}
        >
            {children}
        </Button>
    );
});

export { Button, FormSubmitButton };
