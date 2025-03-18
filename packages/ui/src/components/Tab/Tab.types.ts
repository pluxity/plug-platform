import { HTMLAttributes } from 'react';

export interface TabProps extends HTMLAttributes<HTMLDivElement>{
    className?: string;
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement>{
    ariaLabel?: string;
    className?: string;
}

export interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement>{
    isActive?: boolean;
    className?: string;
}

export interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
    isActive?: boolean;
    className?: string;
} 