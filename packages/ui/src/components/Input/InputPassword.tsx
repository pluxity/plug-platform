import * as React from "react";
import { useRef, useState } from "react";
import { InputTextProps } from './InputText';
import { v4 as uuidv4 } from "uuid";
import { cn } from "../../utils/classname";
import PasswordIcon from "../../assets/icons/password.svg";
import HidePasswordIcon from "../../assets/icons/password_hide.svg";

const InputPassword = React.forwardRef<HTMLInputElement, InputTextProps>(({
    labelControl = false,
    labelText,
    helperText = '',
    ariaLabel,
    type,
    invalid = false,
    iconPosition = 'trailing',
    value,
    onChange,
    children,
    className,
    ...props
}, ref) => {
    const [inputHover, setInputHover] = useState(false);
    const [inputFocus, setInputFocus] = useState(false); 
    const [passwordState, setPasswordState] = useState(false);

    const togglePasswordIcon = () => {setPasswordState(!passwordState);};
    const PasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {onChange?.(e);};
    
    const mouseOver = () => {setInputHover(true);};
    const mouseOut = () => {setInputHover(false);};
    const onFocus = () => {setInputFocus(true);};
    const onBlur = () => {setInputFocus(false);};
    
    const iconColor = invalid ? 'red' : props.disabled ? 'lightgray' : inputHover || inputFocus  ? 'black' : 'lightgray'; 

    const labelWrapStyle = "inline-flex items-center gap-1";
    const labelTextStyle = "text-sm";

    const inputWrapStyle = `${invalid === true ? "border-red-600" : props.disabled ? "border-gray-300 bg-gray-200" : "border-gray-400"} inline-flex items-center border border-1 rounded-xs h-9 w-45`;
    const InputTextStyle = `${invalid === true ? "enabled:placeholder:text-red-600 text-red-600" : "placeholder:text-gray-300 enabled:hover:placeholder:text-black focus:placeholder:text-black text-black"} outline-none cursor-pointer text-xs placeholder:text-xs h-full p-2 disabled:text-gray-300 disabled:cursor-not-allowed`;

    const helperTextStyle = "text-xs";

    const uniqueIdRef = useRef(uuidv4());
    const inputTextId = `input-${uniqueIdRef.current}`
    const helperTextId = `helper-${uniqueIdRef.current}`;

    const iconControl = () => {
        if(invalid || inputFocus){
            const PasswordIconComponent = PasswordIcon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
            const HidePasswordIconComponent = HidePasswordIcon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
    
            return (
                <button type="button" className="pr-2" onClick={togglePasswordIcon}>
                    {!passwordState ? <HidePasswordIconComponent fill={iconColor}/> : <PasswordIconComponent fill={iconColor}  />}
                </button>
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
                        onMouseOver={mouseOver} 
                        onMouseOut={mouseOut}  
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
                            <input
                                id={inputTextId}
                                type={passwordState ? 'text' : 'password'}
                                value={value}
                                onChange={PasswordChange}
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
                            {iconControl()}
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
                            onChange={PasswordChange}
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
                        {iconControl()}
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

InputPassword.displayName = 'InputPassword';

export { InputPassword };
