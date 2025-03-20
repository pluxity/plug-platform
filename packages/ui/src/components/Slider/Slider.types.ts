export interface SliderProps extends React.HTMLAttributes<HTMLSpanElement> {
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
}

export interface SliderTrackProps extends React.HTMLAttributes<HTMLSpanElement> {
    className?: string;
}

export interface SliderRangeProps extends React.HTMLAttributes<HTMLSpanElement> {
    className?: string;
}

export interface SliderThumbProps extends React.HTMLAttributes<HTMLInputElement> {
    className?: string;
}
