import * as React from "react";
import { useState, useRef, useEffect, useId } from "react";
import { cn } from '../../utils/classname';
import AccordionIcon from '../../assets/icons/Accordion.svg';
import type { 
  AccordionProps, 
  AccordionItemProps, 
  AccordionTriggerProps, 
  AccordionContentProps 
} from './Accordion.types';


const Accordion = React.memo(({ 
  type = "single",
  collapsible = false,
  onChange,
  className, 
  children,
  ...props 
}: AccordionProps) => {
  
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
        if (React.isValidElement(child) && child.type === AccordionItem) {
            return React.cloneElement(child, {
                isOpen: accordionState.has((child.props as AccordionItemProps).value),
                onToggle: () => accordionUpdate((child.props as AccordionItemProps).value),
            } as AccordionItemProps);
        }
        return child;
    });

    return (
        <div
          className={cn("flex flex-col bg-gray-100", className)}
          {...props}
          >
          {elementProps}
        </div>
    );
});

Accordion.displayName = 'Accordion';

const AccordionItem = React.memo(({ 
  disabled = false,
  isOpen = false, 
  onToggle,
  className,  
  children,
  ...props 
}: AccordionItemProps) => {
  const uniqueId = useId();
  const buttonId = `button-${uniqueId}`;
  const contentId = `content-${uniqueId}`;

  const elementProps = React.Children.map(children, child => {
    if(React.isValidElement(child)){
        if(child.type === AccordionTrigger){
            return React.cloneElement(child, {
                isOpen,
                disabled,
                id: buttonId,
                "aria-controls": contentId,
                onToggle,
            } as AccordionTriggerProps);
        }

        if(child.type === AccordionContent){
            return React.cloneElement(child, {
                isOpen,
                id: contentId,
                "aria-labelledby": buttonId,
            } as AccordionContentProps);
        }
    }
    return child;
  });

  return (
    <div
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

const AccordionTrigger = React.memo(({ 
  isOpen = false,
  disabled = false,
  onToggle,
  className, 
  children, 
  ref,
  ...props 
}: AccordionTriggerProps) => {
 
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
        "transform transition-transform will-change-transform",
        isOpen 
          ? "rotate-180 duration-400 ease-out" 
          : "rotate-0 duration-400 ease-in"
      )}>
        <AccordionIcon />
      </span>
    </button>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";


const AccordionContent = React.memo(({ 
    isOpen = false,
    className, 
    children, 
    ref,
    ...props 
  }: AccordionContentProps) => {
    
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);
    
    useEffect(() => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        setContentHeight(height);
      }
    }, []); 

    return (
      <div
        ref={ref}
        role="region"
        className={cn(
          "overflow-hidden bg-white",
          className
        )}
        style={{
          maxHeight: isOpen ? `${contentHeight + 32}px` : '0', 
          transitionDuration: isOpen ? '600ms' : '300ms',
          transitionTimingFunction: isOpen ? 'ease-out' : 'ease-in-out',
          willChange: 'max-height',
        }}

        {...props}
      >
        <div 
          ref={contentRef}
          className={cn("py-4 px-4")}
        >
          {children}
        </div>
      </div>
    );
  });

AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };