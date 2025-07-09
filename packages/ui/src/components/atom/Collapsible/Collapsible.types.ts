import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

export interface CollapsibleProps extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
    className?: string;
}

export interface CollapsibleTriggerProps extends React.ComponentProps<typeof CollapsiblePrimitive.Trigger> {
    children?: React.ReactNode;
    asChild?: boolean;
    className?: string;
}

export interface CollapsibleContentProps extends React.ComponentProps<typeof CollapsiblePrimitive.Content> {
    children?: React.ReactNode;
    className?: string;
}


