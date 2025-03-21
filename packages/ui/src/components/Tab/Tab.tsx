import * as React from "react";
import { useState, useContext, createContext } from "react";
import { cn } from "../../utils/classname";
import type {
    TabProps,
    TabListProps,
    TabTriggerProps,
    TabContentProps,
} from "./Tab.types";

interface TabContextProps {
    currentValue?: string;
    setCurrentValue: (value: string) => void;
}
const TabContext = createContext<TabContextProps | undefined>(undefined);

const Tab = React.forwardRef<HTMLDivElement, TabProps>(({
    defaultValue,
    value,
    onValueChange,
    className,
    children,
    ...props
}, ref) => {

    const [isTabValue, setIsTabValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : isTabValue;

    const setCurrentValue = (value: string) => {
        if (!isControlled) {
            setIsTabValue(value);
        }
        onValueChange?.(value);
    };

    return(
        <TabContext.Provider value={{ currentValue, setCurrentValue }}>
            <div
                className={cn("w-full", className)}
                ref={ref}
                {...props}
            >   
                {children}
            </div>
        </TabContext.Provider>
    );
});

Tab.displayName = "Tab";

const TabList = ({
    color = "primary",
    className,
    children,
    ...props
}: TabListProps) => {
    const tabListStyle = "flex item-center gap-1 w-full";

    const elementProps = React.Children.map(children, child => {
        if (React.isValidElement(child) && child.type === TabTrigger) {
            return React.cloneElement(child, {
                color,
            } as TabTriggerProps);
        }
        return child;
    });

    return(
        <div
            aria-orientation="horizontal"
            role="tablist"
            className={cn(
                tabListStyle,
                className 
            )}
            {...props}
        >
            {elementProps}
        </div>
    )
};

TabList.displayName = "TabList";

const TabTrigger = ({
    color = "primary",
    className,
    children,
    value,
    ...props
}: TabTriggerProps) => {
    const context = useContext(TabContext);
    
    if (!context) {
      throw new Error("TabTrigger는 Tab 구성 요소 내에서 사용해야 합니다. <Tab.Trigger>가 <Tab> 구성 요소 내부에 중첩되어 있는지 확인하세요.");
    }
    const { currentValue , setCurrentValue } = context;
    const isActive = currentValue === value;
    
    const tabTriggerStyle = `
        inline-flex item-center justify-center w-full px-3 py-2 cursor-pointer font-semibold text-gray-600 border-b-2
        ${isActive ? "border-b-2" : "border-transparent"}
    `;
    const tabTriggerAnimate = "transition-all ease-in-out duration-300";

    const tabTriggerColor = {
        primary:  isActive && "text-primary-500 border-primary-500",
        secondary:  isActive && "text-secondary-500 border-secondary-500",
    }[color];
   
    return(
        <button
            aria-selected={isActive}
            role="tab"
            type="button"
            onClick={() => setCurrentValue(value)}
            className={cn(
                tabTriggerStyle, 
                tabTriggerAnimate,
                tabTriggerColor,
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
};

TabTrigger.displayName = "TabTrigger";

const TabContent = ({
    className,
    children,
    value,
    ...props
}: TabContentProps) => {
    const context = useContext(TabContext);
    
    if (!context) {
      throw new Error("TabContent는 Tab 구성 요소 내에서 사용해야 합니다. <Tab.Content>가 <Tab> 구성 요소 내에 중첩되어 있는지 확인하세요.");
    }
    const { currentValue } = context;
    const isActive = currentValue === value;
    
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
            {...props}
        >
            {children}
        </div>
    )
};

TabContent.displayName = "TabContent";

export { Tab, TabList, TabTrigger, TabContent };