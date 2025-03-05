import * as React from "react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "../../utils/classname";
import Password from "../../assets/icons/input_password.svg";
import Notice from "../../assets/icons/input_notice.svg";

export interface InputTextProps extends React.ComponentProps<'input'>{
    labelControl?: boolean;
    labelText?: string;
    helperText?: string;
    ariaLabel?: string;
    type?: string;
    invalid?: boolean;
    iconPosition?: 'leading' | 'trailing';
    iconSvg?: string;
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
    ...props }, ref) => {

    const inputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
    };

    const labelWrapStyle = "inline-flex items-center gap-1";
    const labelTextStyle = "text-sm";

    const inputWrapStyle = `${invalid === true ? "border-red-600" : props.disabled ? "border-gray-300" : "border-gray-400"} inline-flex items-center border border-1 rounded-xs h-9`;
    const InputTextStyle = `${invalid === true ? "enabled:placeholder:text-red-600 text-red-600" : "placeholder:text-gray-300 enabled:hover:placeholder:text-black focus:placeholder:text-black text-black"} outline-none cursor-pointer text-xs placeholder:text-xs h-full p-2 disabled:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed`;

    const helperTextStyle = "text-xs";

    const uniqueIdRef = useRef(uuidv4());
    const inputTextId = `input-${uniqueIdRef.current}`
    const helperTextId = `helper-${uniqueIdRef.current}`;

    return (
        <>
            {labelControl ? (
                <>
                    <div className={cn(labelWrapStyle)}>
                        <label 
                            className={labelTextStyle}
                            htmlFor={inputTextId}
                        >
                            {labelText}
                        </label>
                        
                        <div className={cn(inputWrapStyle)}>
                            {iconPosition === "leading" && iconSvg && <span className="pl-2"><img src={iconSvg} alt="input icon" /></span>}
                            <input
                                id={inputTextId}
                                type={type}
                                value={value}
                                onChange={inputTextChange}
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
                            {type === "password" && iconPosition === "trailing" && (
                                <span className="pr-2">
                                    {invalid ? (
                                        <img src={Password} alt="password icon" className="fill-red-600" />
                                    ) : props.disabled ? (
                                        <Password className="fill-gray-300" />
                                    ) : (
                                        <Password className="fill-gray-400" />
                                    )}
                                </span>
                            )}
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
                    <div className={cn(inputWrapStyle)}>
                        {iconPosition === "leading" && <span></span>}
                        <input
                            id={inputTextId}
                            type={type}
                            value={value}
                            onChange={inputTextChange}
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
                        {iconPosition === "trailing" && <span></span>}
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
    )
})

export {InputText};