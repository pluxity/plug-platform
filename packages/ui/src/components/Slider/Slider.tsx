import * as React from 'react';
import { cn } from '../../utils/classname';
import type {
    SliderProps,
    SliderTrackProps,
    SliderThumbProps,
    SliderRangeProps
} from "./Slider.types";

// 스타일 관련 타입 정의 (내부용)
export type SliderSize = 'small' | 'medium' | 'large';
export type SliderColor = 'primary' | 'secondary';

interface SizeClassMap {
    readonly small: string;
    readonly medium: string;
    readonly large: string;
}

interface ColorClassMap {
    readonly primary: string;
    readonly secondary: string;
}

// 스타일 매핑 상수
const sizeToClass: SizeClassMap = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
};

const thumbSizeToClass: SizeClassMap = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
};

const colorToClass: ColorClassMap = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500'
};

// 리액트 컴포넌트 타입 정의
interface ReactComponentWithDisplayName {
    displayName?: string;
}

// 서브 컴포넌트 구현 (React 19 스타일로 ref는 props로 받음)
const SliderTrack = ({
    className,
    currentValue = 0,
    min = 0,
    max = 100,
    color = 'primary',
    disabled,
    ref,
    children,
    ...props
}: SliderTrackProps) => {
    const sliderTrackWidth = ((currentValue - min) / (max - min)) * 100;
    const sliderTrackStyle = `absolute h-full rounded-full ${disabled ? 'bg-gray-300' : ''}`;

    return (
        <div 
            ref={ref}
            className={cn(
                colorToClass[color as SliderColor],
                sliderTrackStyle,
                className
            )}
            style={{ width: `${sliderTrackWidth}%` }}
            {...props}
        >
            {children}
        </div>
    );
};

SliderTrack.displayName = "SliderTrack";

const SliderThumb = ({
    className,
    size = 'small',
    disabled,
    ref,
    ...props
}: SliderThumbProps) => {
    const sliderThumbStyle = `absolute bg-white shadow-[0_2px_3px_3px_rgba(0,0,0,0.2)] rounded-full -translate-y-1/2 -translate-x-1/2 top-1/2 left-full 
    ${disabled ? `cursor-not-allowed` : ''}`;
    
    return (
        <span 
            ref={ref}
            className={cn(
                thumbSizeToClass[size as SliderSize],
                sliderThumbStyle,
                className
            )}
            {...props}
        />
    );
};

SliderThumb.displayName = "SliderThumb";

const SliderRange = ({
    className,
    currentValue = 0,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    ref,
    ...props
}: SliderRangeProps) => {
    const sliderRangeStyle = `absolute w-full h-full opacity-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer' }`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange?.(Number(e.target.value));
    };

    return (
      <input
            type="range"
            ref={ref}
            min={min}
            max={max}
            step={step}
            value={currentValue}
            disabled={disabled}
            aria-label="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue}
            aria-disabled={disabled}
            onChange={handleChange}
            className={cn(
                sliderRangeStyle,
                className
            )}
            {...props}
        />
    );
}; 

SliderRange.displayName = "SliderRange";

// 컴포넌트 타입을 확인하는 함수
const isTrackComponent = (child: React.ReactElement): boolean => 
    child.type === SliderTrack || 
    (typeof child.type === 'object' && (child.type as ReactComponentWithDisplayName).displayName === 'SliderTrack');

const isThumbComponent = (child: React.ReactElement): boolean => 
    child.type === SliderThumb || 
    (typeof child.type === 'object' && (child.type as ReactComponentWithDisplayName).displayName === 'SliderThumb');

const isRangeComponent = (child: React.ReactElement): boolean => 
    child.type === SliderRange || 
    (typeof child.type === 'object' && (child.type as ReactComponentWithDisplayName).displayName === 'SliderRange');

// 메인 컴포넌트 구현
function Slider({
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
    ref,
    ...props
}: SliderProps & { ref?: React.Ref<HTMLDivElement> }) {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleValueChange = (newValue: number) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    // React.Children을 사용하여 props 전달
    const childrenWithProps = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        // 각 컴포넌트 타입에 따라 필요한 props만 전달
        const commonProps = {
            currentValue,
            onValueChange: handleValueChange,
            min,
            max, 
            step,
            disabled
        };

        // 타입에 따라 추가 속성 전달
        if (isTrackComponent(child)) {
            return React.cloneElement(child as React.ReactElement<SliderTrackProps>, { 
                ...commonProps, 
                color 
            });
        } else if (isThumbComponent(child)) {
            return React.cloneElement(child as React.ReactElement<SliderThumbProps>, { 
                ...commonProps, 
                size 
            });
        } else if (isRangeComponent(child)) {
            return React.cloneElement(child as React.ReactElement<SliderRangeProps>, commonProps);
        }
        
        return child;
    });

    return (
        <div 
            ref={ref}
            className={cn(
                "relative rounded-full bg-gray-200",
                sizeToClass[size as SliderSize],
                className
            )}
            {...props}
        >
            {childrenWithProps}
        </div>
    );
}

Slider.displayName = "Slider";

// 서브컴포넌트를 Slider에 직접 추가
Slider.Track = SliderTrack;
Slider.Thumb = SliderThumb;
Slider.Range = SliderRange;

export { Slider, SliderTrack, SliderThumb, SliderRange };