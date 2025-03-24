import * as React from 'react';

export type SliderSize = 'small' | 'medium' | 'large';
export type SliderColor = 'primary' | 'secondary';

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'color'> {
    size?: SliderSize;
    color?: SliderColor;
    defaultValue?: number;
    value?: number;
    onValueChange?: (value: number) => void;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    children?: React.ReactNode;
}

export interface SliderInternalProps {
    currentValue?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}

export interface SliderTrackProps extends React.HTMLAttributes<HTMLDivElement>, SliderInternalProps {
    color?: SliderColor;
    ref?: React.Ref<HTMLDivElement>;
    children?: React.ReactNode;
}

export interface SliderThumbProps extends React.HTMLAttributes<HTMLSpanElement>, SliderInternalProps {
    size?: SliderSize;
    ref?: React.Ref<HTMLSpanElement>;
}

export interface SliderRangeProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'min' | 'max' | 'step'>, SliderInternalProps {
    ref?: React.Ref<HTMLInputElement>;
}