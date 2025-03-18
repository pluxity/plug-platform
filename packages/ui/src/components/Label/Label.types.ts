
import { LabelHTMLAttributes } from "react";
export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    error?: boolean;
    disabled?: boolean;
    focused?: boolean;
    required?: boolean;
    size?: "small" | "medium" | "large";
    className?: string;
}