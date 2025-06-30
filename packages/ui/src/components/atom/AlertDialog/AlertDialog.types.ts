import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export interface AlertDialogProps extends AlertDialogPrimitive.AlertDialogProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    children?: React.ReactNode;
}

export interface AlertDialogTriggerProps extends AlertDialogPrimitive.AlertDialogTriggerProps {
    asChild?: boolean;
    children?: React.ReactNode;
}

export interface AlertDialogPortalProps extends AlertDialogPrimitive.AlertDialogPortalProps {
    children?: React.ReactNode;
}

export interface AlertDialogOverlayProps extends AlertDialogPrimitive.AlertDialogOverlayProps {
    className?: string;
    children?: React.ReactNode;
}

export interface AlertDialogContentProps extends AlertDialogPrimitive.AlertDialogContentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface AlertDialogHeaderProps extends React.ComponentProps<"div"> {
    className?: string;
    children?: React.ReactNode;
}

export interface AlertDialogFooterProps extends React.ComponentProps<"div"> {
    className?: string;
    children?: React.ReactNode;
}

export interface AlertDialogTitleProps extends AlertDialogPrimitive.AlertDialogTitleProps {
    className?: string;
    children?: React.ReactNode;
}

export interface AlertDialogDescriptionProps extends AlertDialogPrimitive.AlertDialogDescriptionProps {
    className?: string;
    children?: React.ReactNode;
}   

export interface AlertDialogActionProps extends AlertDialogPrimitive.AlertDialogActionProps {
    className?: string;
    children?: React.ReactNode;
}           

export interface AlertDialogCancelProps extends AlertDialogPrimitive.AlertDialogCancelProps {
    className?: string;
    children?: React.ReactNode;
}




