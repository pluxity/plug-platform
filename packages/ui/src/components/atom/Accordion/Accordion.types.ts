import * as AccordionPrimitive from "@radix-ui/react-accordion"

export type AccordionProps = (AccordionPrimitive.AccordionSingleProps | AccordionPrimitive.AccordionMultipleProps) & {
    type?: "single" | "multiple";
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    collapsible?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export interface AccordionItemProps extends AccordionPrimitive.AccordionItemProps {
    value: string;
    className?: string;
    children?: React.ReactNode;
}

export interface AccordionTriggerProps extends AccordionPrimitive.AccordionTriggerProps {
    className?: string;
    children?: React.ReactNode;
}

export interface AccordionContentProps extends AccordionPrimitive.AccordionContentProps {
    className?: string;
    children?: React.ReactNode;
}



    
