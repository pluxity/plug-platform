import { HTMLAttributes } from 'react';

export interface TabProps extends HTMLAttributes<HTMLDivElement>{
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    ref?: React.RefObject<HTMLDivElement>;
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement>{
    color?: "primary" | "secondary";
    className?: string;
}

export interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement>{
    isActive?: boolean;
    value: string;
    className?: string;
    color?: "primary" | "secondary";
}

export interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
    isActive?: boolean;
    value: string;
    className?: string;
} 