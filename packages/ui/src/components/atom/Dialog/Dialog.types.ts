import * as DialogPrimitive from "@radix-ui/react-dialog";

export interface DialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
    children?: React.ReactNode;
    className?: string;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    open?: boolean;
    defaultOpen?: boolean;      
}

export interface DialogTriggerProps extends React.ComponentProps<typeof DialogPrimitive.Trigger> {
  children?: React.ReactNode;
}

export interface DialogOverlayProps extends React.ComponentProps<typeof DialogPrimitive.Overlay> {
  dimmed?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  children?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  dimmed?: boolean;
  title?: string;
}

export interface DialogHeaderProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  className?: string;
}

export interface DialogFooterProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  className?: string;
}

export interface DialogTitleProps extends React.ComponentProps<typeof DialogPrimitive.Title> {
  children?: React.ReactNode;
  className?: string;
}

export interface DialogDescriptionProps extends React.ComponentProps<typeof DialogPrimitive.Description> {
  children?: React.ReactNode;
  className?: string;
}
