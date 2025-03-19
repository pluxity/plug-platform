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
    const [tabActive, setTabActive] = useState(0);
    const handleTabClick = (index: number) => {
        setTabActive(index);
    };
    const uniqueIdRef = useRef(uuidv4());

    const tabTriggers = React.Children.toArray(children).filter(
        (child) => React.isValidElement(child) && child.type === TabTrigger
    );
    const tabTriggerElement = tabTriggers.map((child, index) => {
        if (React.isValidElement(child) && child.type === TabTrigger) {
            return React.cloneElement(child, {
                id: `trigger-${uniqueIdRef.current}-${index}`,
                "aria-controls": `panel-${uniqueIdRef.current}-${index}`,
                isActive: tabActive === index,
                onClick: () => handleTabClick(index),
            } as TabTriggerProps);
        }
        return child;
    });

    const tabContents = React.Children.toArray(children).filter(
        (child) => React.isValidElement(child) && child.type === TabContent
    );
    const tabContentElement = tabContents.map((child, index) => {
        if (React.isValidElement(child) && child.type === TabContent) {
            return React.cloneElement(child, {
                id: `panel-${uniqueIdRef.current}-${index}`,
                "aria-labelledby": `trigger-${uniqueIdRef.current}-${index}`,
                isActive: tabActive === index, 
            } as TabContentProps);
        }
        return child;
    });

    return(
        <div
            className={cn("w-full", className)}
            ref={ref}
            {...props}
        >   
            {tabTriggerElement}
            {tabContentElement}
        </div>
    );
});

Tab.displayName = "Tab";

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(({
    ariaLabel,
    className,
    children,
    ...props
}, ref) => {

    const tabListStyle = "flex item-center gap-1 w-full";

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
            {children}
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