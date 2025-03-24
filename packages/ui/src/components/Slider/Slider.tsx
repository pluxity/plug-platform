import * as React from 'react';
import { cn } from '../../utils/classname';
import type {
    SliderProps,
    SliderTrackProps,
    SliderThumbProps,
    SliderRangeProps,
    SliderInternalProps,
    SliderSize,
    SliderColor
} from "./Slider.types";

const sizeToClass: Record<SliderSize, string> = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
};

const thumbSizeToClass: Record<SliderSize, string> = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
};

const colorToClass: Record<SliderColor, string> = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500'
};

interface ReactComponentWithDisplayName {
    displayName?: string;
}

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

    // 자식 컴포넌트에 size 속성 전달
    const childrenWithProps = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        if (isThumbComponent(child)) {
            const thumbElement = child as React.ReactElement<SliderThumbProps>;
            return React.cloneElement(thumbElement, { 
                currentValue,
                min,
                max,
                disabled
            });
        }
        
        return child;
    });

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
            {childrenWithProps}
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

    const internalProps: SliderInternalProps = {
        currentValue,
        onValueChange: handleValueChange,
        min,
        max, 
        step,
        disabled
    };

    const hasChildren = React.Children.count(children) > 0;
    
    let childContent;
    if (hasChildren) {
        childContent = React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;

            if (isTrackComponent(child)) {
                return React.cloneElement(child as React.ReactElement<SliderTrackProps>, { 
                    ...internalProps, 
                    color,
                });
            } else if (isRangeComponent(child)) {
                return React.cloneElement(child as React.ReactElement<SliderRangeProps>, internalProps);
            }
            
            return child;
        });
    } else {
        childContent = (
            <>
                <SliderTrack color={color} {...internalProps}>
                    <SliderThumb size={size} />
                </SliderTrack>
                <SliderRange {...internalProps} />
            </>
        );
    }

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
            {childContent}
        </div>
    );
}

Slider.displayName = "Slider";

Slider.Track = SliderTrack;
Slider.Thumb = SliderThumb;
Slider.Range = SliderRange;

export { Slider };