import * as React from "react";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "../../utils/classname";

export interface InputTextProps extends React.ComponentProps<'input'> {
    labelControl?: boolean;
    labelText?: string;
    helperText?: string;
    ariaLabel?: string;
    type?: string;
    invalid?: boolean;
    iconPosition?: 'leading' | 'trailing';
    iconSvg?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(({
    labelControl = false,
    labelText,
    helperText = '',
    ariaLabel,
    type,
    invalid = false,
    iconPosition = 'leading',
    iconSvg,
    value,
    onChange,
    className,
    ...props
}, ref) => {

    const [inputFocus, setInputFocus] = useState(false); 

    const TextChange = (e: React.ChangeEvent<HTMLInputElement>) => {onChange?.(e);};

    const onFocus = () => {setInputFocus(true);};
    const onBlur = () => {setInputFocus(false);};
    
    const iconColor = invalid ? 'red' : props.disabled ? 'lightgray' : inputFocus  ? 'black' : 'lightgray'; 

    const labelWrapStyle = "inline-flex items-center gap-1";
    const labelTextStyle = "text-sm";

    const inputWrapStyle = `${invalid === true ? "border-red-600" : props.disabled ? "border-gray-300 bg-gray-200" : "border-gray-400"} inline-flex items-center border border-1 rounded-xs h-9 w-45 `;
    const InputTextStyle = `${invalid === true ? "enabled:placeholder:text-red-600 text-red-600" : "placeholder:text-gray-300 focus:placeholder:text-black text-black"} outline-none cursor-pointer text-xs placeholder:text-xs h-full p-2 disabled:text-gray-300 disabled:cursor-not-allowed`;

    const helperTextStyle = "text-xs";

    const uniqueIdRef = useRef(uuidv4());
    const inputTextId = `input-${uniqueIdRef.current}`
    const helperTextId = `helper-${uniqueIdRef.current}`;

    const iconControl = (position: 'leading' | 'trailing') => {
        if (iconSvg) {
            const IconSvg = iconSvg as React.FC<React.SVGProps<SVGSVGElement>>;

            return (
                <span className={position === 'leading' ? "pl-2" : "pr-2"} >
                    <IconSvg fill={iconColor} />
                </span>
            );
        }
        return null; 
    };

    return (
        <>
            {labelControl ? (
                <>
                    <div
                        className={cn(labelWrapStyle)}
                        onFocus={onFocus}  
                        onBlur={onBlur}    
                    >
                        <label
                            className={labelTextStyle}
                            htmlFor={inputTextId}
                        >
                            {labelText}
                        </label>

                        <div className={cn(inputWrapStyle)}>
                            {iconPosition === "leading" && iconSvg && iconControl('leading')}
                            <input
                                id={inputTextId}
                                type={type}
                                value={value}
                                onChange={TextChange}
                                aria-describedby={helperTextId}
                                aria-label={ariaLabel}
                                aria-invalid={invalid}
                                className={cn(
                                    InputTextStyle,
                                    className
                                )}
                                ref={ref}
                                {...props}
                            />
                            {iconPosition === "trailing" && iconSvg && iconControl('trailing')}
                        </div>
                    </div>
                    {helperText.length >= 0 &&
                        <p
                            id={helperTextId}
                            className={cn(helperTextStyle)}
                        >
                            {helperText}
                        </p>
                    }
                </>
            ) : (
                <>
                    <div 
                        className={cn(inputWrapStyle)}
                        onFocus={onFocus}  
                        onBlur={onBlur} 
                    >
                        {iconPosition === "leading" && iconSvg && iconControl('leading')}
                        <input
                            id={inputTextId}
                            type={type}
                            value={value}
                            onChange={TextChange}
                            aria-describedby={helperTextId}
                            aria-label={ariaLabel}
                            aria-invalid={invalid}
                            className={cn(
                                InputTextStyle,
                                className
                            )}
                            ref={ref}
                            {...props}
                        />
                        {iconPosition === "trailing" && iconSvg && iconControl('trailing')}
                    </div>
                    {helperText.length >= 0 &&
                        <p
                            id={helperTextId}
                            className={cn(helperTextStyle)}
                        >
                            {helperText}
                        </p>
                    }
                </>
            )}
        </>
    );
});

InputText.displayName = 'InputText';

export { InputText };
