import * as React from "react";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "../../utils/classname";
import type {
    TabProps,
    TabListProps,
    TabTriggerProps,
    TabContentProps,
} from "./Tab.types";

const Tab = React.forwardRef<HTMLDivElement, TabProps>(({
    className,
    children,
    ...props
}, ref) => {
    return(
        <div
            className={cn("w-full" , className)}
            ref={ref}
            {...props}
        >
            {children}
        </div>
    )
});

Tab.displayName = "Tab";

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(({
    ariaLabel,
    className,
    children,
    ...props
}, ref) => {

    const tabListStyle = "flex item-center gap-1 w-full";

    const uniqueIdRef = useRef(uuidv4());
    const triggerId = `button-${uniqueIdRef.current}`;
    const contentId = `content-${uniqueIdRef.current}`;

    const [tabActive, setTabActive] = useState(0);
    const handleTabClick = (index: number) => {
        setTabActive(index);
    }
    const ElementProps = React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === TabTrigger) {
          return React.cloneElement(child, {
            id: triggerId,
            "aria-controls": contentId,
            isActive: tabActive === index,
            onClick: () => handleTabClick(index),
          } as TabTriggerProps );
        }
        if (React.isValidElement(child) && child.type === TabContent) {
            return React.cloneElement(child,{
                id: contentId,
                "aria-labelledby": triggerId,
                isActive: tabActive === index,
            } as TabContentProps );
        }
        return child;
      });

return(
    <div
        ref={ref}
        aria-orientation="horizontal"
        aria-label={ariaLabel}
        role="tablist"
        className={cn(
            tabListStyle,
            className 
        )}
        {...props}
        >
            {ElementProps}
        </div>
    )
});

TabList.displayName = "TabList";

const TabTrigger = React.forwardRef<HTMLButtonElement, TabTriggerProps>(({
    isActive,
    className,
    children,
    ...props
}, ref) => {
    
    const tabTriggerStyle = `
        inline-flex item-center justify-center w-full px-3 py-2 cursor-pointer font-semibold text-gray-600 border-b-2 border-transparent
        ${isActive && "text-primary-500 border-b-2 border-primary-500"}
    `;
    const tabTriggerAnimate = "transition-all ease-in-out duration-300";
   
    return(
        <button
            aria-selected={isActive}
            role="tab"
            type="button"
            className={cn(
                tabTriggerStyle, 
                tabTriggerAnimate,
                
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    )
});

TabTrigger.displayName = "TabTrigger";

const TabContent = React.forwardRef<HTMLDivElement, TabContentProps>(({
    isActive,
    className,
    children,
    ...props
}, ref) => {
    
    const tabContentStyle = `
        mt-3 transition-all ease-in-out duration-300,
        ${isActive ? "block" : "hidden"}`;

    
    return(
        <div
            aria-hidden={!isActive}
            role="tabpanel"
            className={cn(
                tabContentStyle, 
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </div>
    )
});

TabContent.displayName = "TabContent";

export { Tab, TabList, TabTrigger, TabContent };