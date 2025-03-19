
import { LabelHTMLAttributes } from "react";
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    color?: "primary" | "secondary" | "destructive";
    required?: boolean;
    size?: "small" | "medium" | "large";
    className?: string;
}