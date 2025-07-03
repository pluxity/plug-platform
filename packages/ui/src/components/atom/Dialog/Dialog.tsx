import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "../../../utils/utils";
import {
  DialogProps,
  DialogTriggerProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
} from "./Dialog.types";

function Dialog({
  ...props
}: DialogProps) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

Dialog.displayName = "Dialog";    

function DialogTrigger({
  ...props
}: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

DialogTrigger.displayName = "DialogTrigger";

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

DialogPortal.displayName = "DialogPortal";

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
} 

DialogClose.displayName = "DialogClose";

function DialogOverlay({
  className,
  dimmed = false,
  ...props
}: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50",
        dimmed ? "bg-black/50" : "bg-transparent",
        className
      )}
      {...props}
    />
  )
} 

DialogOverlay.displayName = "DialogOverlay";

function DialogContent({
  className,
  children,
  showCloseButton = true,
  dimmed = false,
  title,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay dimmed={dimmed} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          `bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
          fixed top-[50%] left-[50%] z-50 w-full max-w-xl translate-x-[-50%] translate-y-[-50%]
          rounded-md bg-white shadow-[0_0_10px_rgba(0,0,0,0.4)] duration-200 overflow-hidden
          focus:outline-none`,
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between bg-muted-light-blue1 p-4">
          {title && <DialogTitle className="text-subtitle text-black">{title}</DialogTitle>}
          {showCloseButton && (
            <DialogPrimitive.Close className="text-black">
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </div>

        {/* 본문 */}
        <div className="p-6">{children}</div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

DialogContent.displayName = "DialogContent";

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

DialogHeader.displayName = "DialogHeader";

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex justify-center gap-2 pt-4", className)}
      {...props}
    />
  )
}

DialogFooter.displayName = "DialogFooter";

function DialogTitle({
  className,
  ...props
}: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

DialogTitle.displayName = "DialogTitle";

function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
