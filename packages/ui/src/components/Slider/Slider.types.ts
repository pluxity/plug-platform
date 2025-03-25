import React from 'react';

export interface SliderContextProps {
    disabled?: boolean;
    currentValue: number;
    setCurrentValue: (value: number) => void;
    min: number;
    max: number;
    step: number;
    size: 'small' | 'medium' | 'large';
    color: 'primary' | 'secondary';
    sliderId: string;
    sliderRef: { current: HTMLDivElement | null };
}

export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: number;
    value?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary';
    className?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

export interface SliderTrackProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
}

export interface SliderThumbProps extends React.HTMLAttributes<HTMLSpanElement> {
    className?: string;
    tabIndex?: number;
    size?: 'small' | 'medium' | 'large';
}

export interface SliderRangeProps extends React.HTMLAttributes<HTMLInputElement> {
    className?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
