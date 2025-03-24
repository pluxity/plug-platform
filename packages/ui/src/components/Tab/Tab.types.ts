import * as React from 'react';

// 기본 Tab 컴포넌트 Props
export interface TabProps extends React.HTMLAttributes<HTMLDivElement>{
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

export interface TabInternalProps {
    selectedValue?: string;
    onSelect?: (value: string) => void;
}

export interface TabListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>, Partial<TabInternalProps> {
    color?: "primary" | "secondary";
    className?: string;
}

export interface TabTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    value: string;
    className?: string;
    color?: "primary" | "secondary";
    isActive?: boolean;
    onClick?: () => void;
}

export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    className?: string;
    isActive?: boolean;
} 