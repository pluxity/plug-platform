import * as React from "react";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from '../../utils/classname';
import AccordionIcon from '../../assets/icons/Accordion.svg';
import type { 
  AccordionProps, 
  AccordionItemProps, 
  AccordionTriggerProps, 
  AccordionContentProps 
} from './Accordion.types';


const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
({ 
  type = "single",
  collapsible = false,
  onChange,
  className, 
  children,
  ...props 
}, ref) => {
  
    const [accordionState, setAccordionState] = useState<Set<string>>(new Set());

    const accordionUpdate = (value: string) => {
      setAccordionState(prev => {
            const accordionItem = new Set(prev);
            if(type === "single"){
                if(accordionItem.has(value)){
                    if(collapsible === true){
                        accordionItem.delete(value);
                    }
                }else{
                    accordionItem.clear();
                    accordionItem.add(value);
                }
            }else{
                // 다중 모드 
                if(accordionItem.has(value)){
                    accordionItem.delete(value);
                }else{
                    accordionItem.add(value);
                }
            }

            if (onChange) {
              onChange(value);
            }

            return accordionItem;
        });
    }

    const elementProps = React.Children.map(children, child => {
        if (React.isValidElement(child) && (child.type as any) === AccordionItem) {
            return React.cloneElement(child, {
                isOpen: accordionState.has((child.props as any).value),
                onToggle: () => accordionUpdate((child.props as any).value)
            } as any);
        }
        return child;
    });

    return (
        <div
        ref={ref}
        className={cn("flex flex-col bg-gray-100", className)}
        {...props}
        >
        {elementProps}
        </div>
    );
});

Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
({ 
  value,
  disabled = false,
  isOpen = false, 
  onToggle,
  className,  
  children,
  ...props 
}, ref) => {

  const uniqueIdRef = useRef(uuidv4());
  const buttonId = `button-${uniqueIdRef.current}`;
  const contentId = `content-${uniqueIdRef.current}`;

  const elementProps = React.Children.map(children, child => {
    if(React.isValidElement(child)){
        if((child.type as any) === AccordionTrigger){
          return React.cloneElement(child, {
            isOpen,
            disabled,
            id: buttonId,
            "aria-controls": contentId,
            onToggle,
          } as any);
        }

        if((child.type as any) === AccordionContent){
          return React.cloneElement(child,{
            isOpen,
            id: contentId,
            "aria-labelledby": buttonId,
          } as any);
        }
    }
    return child;
  });

  return (
    <div
      ref={ref}
      className={cn(
        "border-b border-gray-300", 
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {elementProps}
    </div>
  );
});

AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
({ 
  isOpen = false,
  disabled = false,
  onToggle,
  className, 
  children, 
  ...props 
}, ref) => {
 
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={isOpen}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onToggle}
      className={cn(
        "flex w-full items-center justify-between py-4 px-4 text-left font-medium transition-all",
        disabled && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
      <span className={cn(
        "transform transition-transform duration-500 will-change-transform",
        isOpen && "rotate-180"
      )}>
        <AccordionIcon />
      </span>
    </button>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
({ 
  isOpen = false,
  className, 
  children, 
  ...props 
}, ref) => {
  
  return (
    <div
      ref={ref}
      role="region"
      className={cn(
        "overflow-hidden transition-all bg-white will-change-[height,opacity]",
        isOpen 
          ? "max-h-[1000px] duration-[2000ms] ease-in-out" 
          : "max-h-0 duration-700 ease-in-out", 
        className
      )}
      {...props}
    >
      <div className="py-4 px-4">
        {children}
      </div>
    </div>
  );
});

AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };