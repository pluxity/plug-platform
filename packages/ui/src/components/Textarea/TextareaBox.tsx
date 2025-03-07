import * as React from "react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "../../utils/classname";
import { TextareaHelperText } from "./TextareaHelperText";

export interface TextareaBoxProps extends React.PropsWithChildren<{
  className?: string;
  id?: string;
}> {}

const TextareaBox = React.forwardRef<HTMLDivElement, TextareaBoxProps>(({
  children,
  className,
  id,
  ...props
}, ref) => {

  const uniqueIdRef = useRef(uuidv4());
  const helperId = `helper-${uniqueIdRef.current}`;
  
  const inputChildren = React.Children.toArray(children);
  const inputHelperTexts = inputChildren.filter(child => React.isValidElement(child) && child.type === TextareaHelperText);
  const inputElements = inputChildren.filter(child => !(React.isValidElement(child) && child.type === TextareaHelperText));

  const elementProps = inputElements.map(child => {
    if (!React.isValidElement(child)) return child;

    return React.cloneElement(child as React.ReactElement<any>, { 
        "aria-describedby": inputHelperTexts.length > 0 ? helperId : '',
        ...Object(child.props)
    });
  });

  const helperTextsProp = inputHelperTexts.map(child => {
    if (!React.isValidElement(child)) return child;
    
    return React.cloneElement(child as React.ReactElement<any>, { 
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
      {elementProps}
      {helperTextsProp}
    </div>
  );
});

TextareaBox.displayName = 'TextareaBox';

export { TextareaBox }; 