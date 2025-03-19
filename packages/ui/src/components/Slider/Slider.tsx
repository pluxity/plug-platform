import * as React from 'react';
import { cn } from '../../utils/classname';
import type { 
    SliderProps,
    SliderTrackProps,
    SliderRangeProps,
    SliderThumbProps,
 } from './Slider.types';

const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
    ({
        className,
        ...props
    }, ref) => {

        const sliderStyle = "relative flex w-full touch-none select-none items-center";
        return(
            <span 
                ref={ref}
                className={cn(
                    sliderStyle,
                    className
                )}
                
                {...props}
            >
            </span>
        )
    });
    
Slider.displayName = "Slider";

const SliderTrack = React.forwardRef<HTMLSpanElement, SliderTrackProps>(
    ({
        className,
        ...props
    }, ref) => {

        const sliderTrackStyle = "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary-20";
        return(
            <span 
                ref={ref}
                className={cn(
                    sliderTrackStyle,
                    className
                )}
                
                {...props}
            >
            </span>
        )
    });
        
SliderTrack.displayName = "SliderTrack";

const SliderRange = React.forwardRef<HTMLSpanElement, SliderRangeProps>(
        ({
            className,
            ...props
        }, ref) => {
            return(
                <span 
                    ref={ref}
                    className={cn(
                        className
                    )}
                    
                    {...props}
                >
                </span>
            )
        });
        
SliderRange.displayName = "SliderRange";   

const SliderThumb = React.forwardRef<HTMLSpanElement, SliderThumbProps>(
    ({
        className,
        ...props
    }, ref) => {
        return(
            <span 
                ref={ref}
                className={cn(
                    className
                )}
                
                {...props}
            >
            </span>
        )
    });
    
    SliderThumb.displayName = "SliderThumb";   
    
export { Slider, SliderTrack, SliderRange, SliderThumb };