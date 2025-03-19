import { HTMLAttributes } from 'react';
import * as React from 'react';

export interface AccordionProps {
    type?: "single" | "multiple";
    collapsible?: boolean;
    onChange?: (value: string) => void;
    className?: string;
    children?: React.ReactNode;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
    isOpen?: boolean; 
    onToggle?: () => void;
    className?: string;
    children?: React.ReactNode;
}

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
    isOpen?: boolean;
    disabled?: boolean;
    onToggle?: () => void; 
    className?: string;
    children?: React.ReactNode;
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
    isOpen?: boolean; 
    className?: string;
    children?: React.ReactNode;
} 