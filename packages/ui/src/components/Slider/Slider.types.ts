import * as React from 'react';

// 스타일 관련 타입 (내부용)
type SliderSize = 'small' | 'medium' | 'large';
type SliderColor = 'primary' | 'secondary';

export interface SliderBaseProps {
    size?: SliderSize;
    color?: SliderColor;
    defaultValue?: number;
    value?: number;
    onValueChange?: (value: number) => void;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
}

export interface SliderProps extends SliderBaseProps, Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'color'> {
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