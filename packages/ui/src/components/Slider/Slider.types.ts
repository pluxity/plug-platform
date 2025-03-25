import React from 'react';

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
    ref?: React.RefObject<HTMLDivElement>;
    /**
     * 접근성을 위한 레이블 ID
     */
    'aria-label'?: string;
    /**
     * 외부 레이블을 참조하는 ID
     */
    'aria-labelledby'?: string;
}

export interface SliderTrackProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    ref?: React.RefObject<HTMLDivElement>;
}

export interface SliderThumbProps extends React.HTMLAttributes<HTMLSpanElement> {
    className?: string;
    tabIndex?: number;
}

export interface SliderRangeProps extends React.HTMLAttributes<HTMLInputElement> {
    className?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    ref?: React.RefObject<HTMLInputElement>;
}
