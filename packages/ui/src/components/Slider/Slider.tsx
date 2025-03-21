import * as React from 'react';
import { cn } from '../../utils/classname';
import type {
    SliderProps,
    SliderTrackProps,
    SliderThumbProps,
    SliderRangeProps
} from "./Slider.types";

interface SliderContextProps {
    disabled?: boolean;
    currentValue: number;
    setCurrentValue: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    size: 'small' | 'medium' | 'large';
    color: 'primary' | 'secondary';
}

const SliderContext = React.createContext<SliderContextProps | undefined>(undefined);

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(({
    size = 'small',
    color = 'primary',
    defaultValue = 0,
    value,
    onValueChange,
    disabled,
    min = 0,
    max = 100,
    step = 1,
    className,
    children,
    ...props
}, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const setCurrentValue = (value: number) => {
        if (!isControlled) {
            setInternalValue(value);
        }
        onValueChange?.(value);
    };

    const sliderSize = {
        small: 'h-2',
        medium: 'h-3',
        large: 'h-4'
    }[size];

    return (
        <SliderContext.Provider value={{ 
            disabled, 
            currentValue, 
            setCurrentValue, 
            min, 
            max,
            step,
            size,
            color
        }}>
            <div 
                ref={ref}
                className={cn(
                    "relative rounded-full bg-gray-200",
                    sliderSize,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </SliderContext.Provider>
    );
});

Slider.displayName = "Slider";

const SliderTrack = React.forwardRef<HTMLDivElement, SliderTrackProps>(({
    className,
    ...props
}, ref) => {
    const context = React.useContext(SliderContext);
    if (!context) {
        throw new Error('SliderTrack은 Slider 구성 요소 내에서 사용해야 합니다. <Slider.Track>가 <Slider> 구성 요소 내부에 중첩되어 있는지 확인하세요.');
    }

    const { currentValue, min, max, color, disabled } = context;
    const sliderTrackWidth = ((currentValue - min) / (max - min)) * 100;

    const sliderTrackStyle = `absolute h-full rounded-full ${disabled ? 'bg-gray-300' : ''}`;
    const sliderTrackColor = {
        primary: 'bg-primary-500',
        secondary: 'bg-secondary-500',
    }[color];

    return (
        <div 
            ref={ref}
            className={cn(
                sliderTrackColor,
                sliderTrackStyle,
                className
            )}
            style={{ width: `${sliderTrackWidth}%` }}
            {...props}
        >
        </div>
    );
});

SliderTrack.displayName = "SliderTrack";

const SliderThumb = ({
    className,
    ...props
}: SliderThumbProps) => {
    const context = React.useContext(SliderContext);

    if (!context) {
        throw new Error('SliderThumb은 Slider 구성 요소 내에서 사용해야 합니다. <Slider.Thumb>이 <Slider> 구성 요소 내부에 중첩되어 있는지 확인하세요.');
    }

    const { size, disabled } = context;

    const sliderThumbStyle = `absolute bg-white shadow-[0_2px_3px_3px_rgba(0,0,0,0.2)] rounded-full -translate-y-1/2 -translate-x-1/2 top-1/2 left-full 
    ${disabled ? `cursor-not-allowed` : ''}`;
    
    const sliderThumbSize = {
        small: 'w-3 h-3',
        medium: 'w-4 h-4',
        large: 'w-5 h-5'
    }[size];
    
    return (
        <span 
            className={cn(
                sliderThumbSize,
                sliderThumbStyle,
                className
            )}
            {...props}
        >
        </span>
    );
};

SliderThumb.displayName = "SliderThumb";


const SliderRange = React.forwardRef<HTMLInputElement, SliderRangeProps>(({
    className,
    ...props
}, ref) => {
    const context = React.useContext(SliderContext);

    if (!context) {
        throw new Error('SliderRange는 Slider 구성 요소 내에서 사용해야 합니다. <Slider.Range>가 <Slider> 구성 요소 내부에 중첩되어 있는지 확인하세요.');
    }

    const { disabled, currentValue, setCurrentValue, min, max, step} = context; 

    const sliderRangeStyle = `absolute w-full h-full opacity-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer' }`;

    return (
      <input
            type="range"
            ref={ref}
            min={min}
            max={max}
            step={step}
            value={currentValue}
            disabled={disabled}
            aria-label ="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue}
            aria-disabled={disabled}
            onChange={(e) => setCurrentValue(Number(e.target.value))}
            className={cn(
                sliderRangeStyle,
                className
            )}
            {...props}
        />
    );
}); 

SliderRange.displayName = "SliderRange";


export { Slider, SliderTrack, SliderThumb, SliderRange };