import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import { cn } from "../../../utils/utils";
import { 
  CommandProps, 
  CommandInputProps, 
  CommandListProps, 
  CommandEmptyProps, 
  CommandGroupProps, 
  CommandSeparatorProps, 
  CommandItemProps, 
  CommandShortcutProps,
  CommandDialogProps
} from "./Command.types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../Dialog/Dialog";

function Command({
  className,
  ...props
}: CommandProps) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-xs border border-light-gray",
        className
      )}
      {...props}
    />
  )
}

Command.displayName = "Command";      

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

CommandDialog.displayName = "CommandDialog";
function CommandInput({
  className,
  ...props
}: CommandInputProps) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

CommandInput.displayName = "CommandInput";

function CommandList({
  className,
  ...props
}: CommandListProps) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

CommandList.displayName = "CommandList";

function CommandEmpty({
  ...props
}: CommandEmptyProps) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

CommandEmpty.displayName = "CommandEmpty";

function CommandGroup({
  className,
  ...props
}: CommandGroupProps) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  )
}

CommandGroup.displayName = "CommandGroup";

function CommandSeparator({
  className,
  ...props
}: CommandSeparatorProps) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  )
}

CommandSeparator.displayName = "CommandSeparator";

function CommandItem({
  className,
  ...props
}: CommandItemProps) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        `
          relative flex cursor-default items-center gap-2 
          px-2 py-1.5 text-sm select-none outline-none
          text-gray          
          hover:text-black
          data-[selected=true]:text-point-blue
          data-[selected=true]:bg-transparent
          data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50
          [&_svg:not([class*='text-'])]:text-muted-foreground
          [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
        `,
        className
      )}
      {...props}
    />
  )
}

CommandItem.displayName = "CommandItem";

function CommandShortcut({
  className,
  ...props
}: CommandShortcutProps) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
