import * as AccordionPrimitive from "@radix-ui/react-accordion"

export type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root> & {
    type?: "single" | "multiple";
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    collapsible?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export interface AccordionItemProps extends React.ComponentProps<typeof AccordionPrimitive.Item> {
    value: string;
    className?: string;
    children?: React.ReactNode;
}

export interface AccordionTriggerProps extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
    className?: string;
    children?: React.ReactNode;
}

export interface AccordionContentProps extends React.ComponentProps<typeof AccordionPrimitive.Content> {
    className?: string;
    children?: React.ReactNode;
}



    
