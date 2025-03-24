import * as React from "react";
import { useState } from "react";
import { cn } from "../../utils/classname";
import type {
    TabProps,
    TabListProps,
    TabTriggerProps,
    TabContentProps,
    TabInternalProps
} from "./Tab.types";

// 컴포넌트 타입 확인을 위한 인터페이스
interface ReactComponentWithDisplayName {
    displayName?: string;
}

// Tab 컴포넌트
const Tab = ({
    defaultValue,
    value,
    onValueChange,
    className,
    children,
    ref,
    ...props
}: TabProps & { ref?: React.Ref<HTMLDivElement> }) => {
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const setCurrentValue = (newValue: string) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <div
            className={cn("w-full", className)}
            ref={ref}
            {...props}
        >   
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;

                // Tab.List 처리
                if (isTabListComponent(child)) {
                    return React.cloneElement(child, {
                        selectedValue: currentValue,
                        onSelect: setCurrentValue,
                    } as Partial<TabInternalProps>);
                }
                
                // Tab.Content 처리
                if (isTabContentComponent(child)) {
                    const contentProps = child.props as TabContentProps;
                    return React.cloneElement(child, {
                        isActive: currentValue === contentProps.value,
                    } as Partial<TabContentProps>);
                }
                
                return child;
            })}
        </div>
    );
};

const TabList = ({
    color = "primary",
    className,
    children,
    selectedValue,
    onSelect,
    ref,
    ...props
}: TabListProps & { ref?: React.Ref<HTMLDivElement> }) => {
    const tabListStyle = "flex item-center gap-1 w-full";

    return (
        <div
            aria-orientation="horizontal"
            role="tablist"
            className={cn(
                tabListStyle,
                className 
            )}
            ref={ref}
            {...props}
        >
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                
                // Trigger 컴포넌트에 필요한 props 전달
                if (isTabTriggerComponent(child)) {
                    const triggerProps = child.props as TabTriggerProps;
                    return React.cloneElement(child, {
                        isActive: selectedValue === triggerProps.value,
                        color,
                        onClick: () => onSelect?.(triggerProps.value),
                    } as Partial<TabTriggerProps>);
                }
                
                return child;
            })}
        </div>
    );
};

TabList.displayName = "TabList";

const TabTrigger = ({
    color = "primary",
    className,
    children,
    isActive,
    onClick,
    ref,
    ...props
}: Omit<TabTriggerProps, 'value'> & { ref?: React.Ref<HTMLButtonElement> }) => {
    const tabTriggerStyle = `
        inline-flex item-center justify-center w-full px-3 py-2 cursor-pointer font-semibold text-gray-600 border-b-2
        ${isActive ? "border-b-2" : "border-transparent"}
    `;
    const tabTriggerAnimate = "transition-all ease-in-out duration-300";

    const tabTriggerColor = {
        primary:  isActive && "text-primary-500 border-primary-500",
        secondary:  isActive && "text-secondary-500 border-secondary-500",
    }[color];
   
    return (
        <button
            aria-selected={isActive}
            role="tab"
            type="button"
            onClick={onClick}
            className={cn(
                tabTriggerStyle, 
                tabTriggerAnimate,
                tabTriggerColor,
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    );
};

TabTrigger.displayName = "TabTrigger";

// TabContent 컴포넌트
const TabContent = ({
    className,
    children,
    isActive,
    ref,
    ...props
}: Omit<TabContentProps, 'value'> & { ref?: React.Ref<HTMLDivElement> }) => {
    const tabContentStyle = `
        mt-3 transition-all ease-in-out duration-300,
        ${isActive ? "block" : "hidden"}`;
    
    return (
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
    );
};

TabContent.displayName = "TabContent";

// 컴포넌트 타입 확인 함수
const isTabListComponent = (child: React.ReactElement): boolean => 
    child.type === TabList || 
    (typeof child.type === 'object' && (child.type as ReactComponentWithDisplayName).displayName === 'TabList');

const isTabTriggerComponent = (child: React.ReactElement): boolean => 
    child.type === TabTrigger || 
    (typeof child.type === 'object' && (child.type as ReactComponentWithDisplayName).displayName === 'TabTrigger');

const isTabContentComponent = (child: React.ReactElement): boolean => 
    child.type === TabContent || 
    (typeof child.type === 'object' && (child.type as ReactComponentWithDisplayName).displayName === 'TabContent');

Tab.displayName = "Tab";

Tab.List = TabList;
Tab.Trigger = TabTrigger;
Tab.Content = TabContent;

export { Tab };