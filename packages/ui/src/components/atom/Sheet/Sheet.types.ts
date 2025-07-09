import * as SheetPrimitive from "@radix-ui/react-dialog"

export interface SheetProps extends React.ComponentProps<typeof SheetPrimitive.Root> {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    modal?: boolean;
}

export interface SheetTriggerProps extends React.ComponentProps<typeof SheetPrimitive.Trigger> {
    children?: React.ReactNode;
    asChild?: boolean;
}

export interface SheetCloseProps extends React.ComponentProps<typeof SheetPrimitive.Close> {
    children?: React.ReactNode;
    asChild?: boolean;
}

export interface SheetOverlayProps extends React.ComponentProps<typeof SheetPrimitive.Overlay> {
  className?: string;
}

export interface SheetContentProps extends React.ComponentProps<typeof SheetPrimitive.Content> {
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  children?: React.ReactNode;
}

export interface SheetHeaderProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SheetFooterProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SheetTitleProps extends React.ComponentProps<typeof SheetPrimitive.Title> {
  children?: React.ReactNode;
  className?: string; 
}

export interface SheetDescriptionProps extends React.ComponentProps<typeof SheetPrimitive.Description> {
  children?: React.ReactNode;
  className?: string;
}
