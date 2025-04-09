import React, { useState } from "react";
import { cn } from "../../utils/classname";
import type { 
    ToggleGroupProps,
    ToggleProps,
} from "./ToggleGroup.types";


const ToggleGroup = ({
    type = "single",
    className,
    ref,
    children,
    ...props
}: ToggleGroupProps) => {
    const [selected, setSelected] = useState< string | string[] | null>(type === "single" ? null : []);

    const onToggleChange = (value: string | undefined) => {
        if (value === undefined) return;
        
        if(type === "single"){
            setSelected(value);
        }else if(type === "multiple"){
            setSelected(prev => {
                if (prev === null) return [value];
                if (Array.isArray(prev)) {
                    if (prev.includes(value)) {
                        return prev.filter(item => item !== value); 
                    } else {
                        return [...prev, value];
                    }
                } else {
                    return [value];
                }
            });
        }
    }

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Toggle) {
            return React.cloneElement(child, {
                onChange: () => {
                    const value = (child.props as ToggleProps).value;
                    if (value !== undefined) {
                        onToggleChange(value);
                    }
                },
                pressed: type === "single" 
                    ? selected === (child.props as ToggleProps).value 
                    : Array.isArray(selected) && selected.includes((child.props as ToggleProps).value),
                value: (child.props as ToggleProps).value
            } as ToggleProps);
        }
        return child;
    });

    return(
        <div
            className={cn(
                'inline-flex items-center gap-2 justify-center',
                className
            )}
            role="group"
            ref={ref}
            {...props}
        >
            {childrenWithProps}
        </div>
    )
}
ToggleGroup.displayName = "ToggleGroup";

export { ToggleGroup, Toggle };

