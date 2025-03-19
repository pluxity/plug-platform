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
    tabClick: (value: string) => void;
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

    const handleTab = (value: string) => {
        if (!isControlled) {
            setIsTabValue(value);
        }
        onValueChange?.(value);
    };

    return(
        <TabContext.Provider value={{ currentValue, tabClick: handleTab }}>
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
    ariaLabel,
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
            aria-label={ariaLabel}
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
      throw new Error("TabTrigger는 Tab 내부에서만 사용할 수 있습니다.");
    }
    const { currentValue , tabClick } = context;
    const isActive = currentValue === value;
    
    const tabTriggerStyle = `
        inline-flex item-center justify-center w-full px-3 py-2 cursor-pointer font-semibold text-gray-600 border-b-2 border-transparent
        ${isActive && "border-b-2"}
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
            onClick={() => tabClick(value)}
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
      throw new Error("TabContent는 Tab 내부에서만 사용할 수 있습니다.");
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