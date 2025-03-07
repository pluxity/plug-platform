import * as React from "react";
import { useState } from "react";
import { cn } from "../../utils/classname";

export interface InputProps extends React.ComponentProps<'input'> {
    id?: string;
    ariaLabel?: string;
    invalid?: boolean;
    iconPosition?: 'leading' | 'trailing';
    iconSvg?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
    renderIcon?: (props: {iconColor: string, isFocused: boolean}) => React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    id,
    ariaLabel,
    type = 'text',
    invalid = false,
    iconPosition = 'leading',
    iconSvg,
    renderIcon,
    value,
    onChange,
    className,
    ...props
}, ref) => {
  const [inputFocus, setInputFocus] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {onChange?.(e);};
  const onFocus = () => {setInputFocus(true);};
  const onBlur = () => {setInputFocus(false);};
  
  const iconColor = invalid ? 'red' : props.disabled ? 'lightgray' : inputFocus ? 'black' : 'lightgray';

  const labelWrapStyle = "inline-flex items-center gap-1";
  const inputWrapStyle = `${invalid === true ? "border-red-600" : props.disabled ? "border-gray-300 bg-gray-200" : "border-gray-400"} inline-flex items-center border border-1 rounded-xs h-9 w-45 `;
  const InputTextStyle = `${invalid === true ? "enabled:placeholder:text-red-600 text-red-600" : "placeholder:text-gray-300 focus:placeholder:text-black text-black"} outline-none text-xs placeholder:text-xs h-full p-2 disabled:text-gray-300 disabled:cursor-not-allowed`;

  const defaultIcon = (position: 'leading' | 'trailing') => {
    if (iconSvg) {
      const IconSvg = iconSvg as React.FC<React.SVGProps<SVGSVGElement>>;
      return (
        <span className={position === 'leading' ? "pl-2" : "pr-2"}>
          <IconSvg fill={iconColor} />
        </span>
      );
    }
    return null;
  };

  const componentIcon = (position: 'leading' | 'trailing') => { 
    if (renderIcon) {
      return renderIcon({ iconColor, isFocused: inputFocus });
    }
    
    return defaultIcon(position);
  };

  return (
    <div
      className={cn(labelWrapStyle)}
      onFocus={onFocus}  
      onBlur={onBlur}    
    > 
      <div className={cn(inputWrapStyle)}>
        {iconPosition === "leading" && componentIcon('leading')}
        <input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          aria-describedby={id}
          aria-label={ariaLabel}
          aria-invalid={invalid}
          className={cn(
            InputTextStyle,
            className
          )}
          ref={ref}
          {...props}
        />
        {iconPosition === "trailing" && componentIcon('trailing')}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

export { Input };