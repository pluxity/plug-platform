import * as React from "react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "../../utils/classname";
import { InputHelperText } from "./InputHelperText";
import { InputLabel } from "./InputLabel";
import { InputText } from "./InputText";
import { InputPassword } from "./InputPassword";

export interface InputBoxProps extends React.HTMLAttributes<HTMLDivElement>{
  className?: string;
}

const InputBox = React.forwardRef<HTMLDivElement, InputBoxProps>(({
  children,
  className,
  ...props
}, ref) => {

  const uniqueIdRef = useRef(uuidv4());
  const inputId = `input-${uniqueIdRef.current}`;
  const helperId = `helper-${uniqueIdRef.current}`;
  
  const inputChildren = React.Children.toArray(children);
  const inputHelperTexts = inputChildren.filter(child => React.isValidElement(child) && child.type === InputHelperText);
  const inputElements = inputChildren.filter( child => !(React.isValidElement(child) && child.type === InputHelperText));
  
  const elementProps = inputElements.map(child => {
    if (!React.isValidElement(child)) return child;
    
    if (child.type === InputLabel) {
      return React.cloneElement(child as React.ReactElement<HTMLLabelElement>, { 
        htmlFor: inputId,
        ...Object(child.props)
      });
    } else if (child.type === InputText || child.type === InputPassword) {
      return React.cloneElement(child as React.ReactElement<HTMLInputElement>, { 
        id: inputId,
        "aria-describedby": inputHelperTexts.length > 0 ? helperId : '',
        ...Object(child.props)
      });
    }
  });
  
  const helperTextsProp = inputHelperTexts.map(child => {
    if (!React.isValidElement(child)) return child;
    
    return React.cloneElement(child as React.ReactElement<HTMLParagraphElement>, { 
      id: helperId,
      ...Object(child.props)
    });
  });
  
  return (
    <div 
      ref={ref}
      className={cn("inline-flex flex-col gap-1", className)} 
      {...props}
    >
      <div className={cn("inline-flex items-center gap-2")}>
        {elementProps}
      </div>
      {helperTextsProp}
    </div>
  );
});

InputBox.displayName = 'InputBox';

export { InputBox }; 