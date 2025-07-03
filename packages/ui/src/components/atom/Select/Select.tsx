import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronUpIcon } from "lucide-react";
import { cn } from "../../../utils/utils";
import { SelectProps, SelectGroupProps, SelectValueProps, SelectTriggerProps, SelectContentProps, SelectLabelProps, SelectItemProps, SelectSeparatorProps, SelectScrollUpButtonProps, SelectScrollDownButtonProps } from "./Select.types";

const ChevronDownArrow = ({ className }: { className?: string }) => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 14 14" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M10.2848 5L11 5.75836L7 10L3 5.75836L3.71515 5L7 8.48329L10.2848 5Z" 
      fill="currentColor"
    />
  </svg>
);

function Select({ ...props }: SelectProps) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

Select.displayName = "Select";

function SelectGroup({ ...props }: SelectGroupProps) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

SelectGroup.displayName = "SelectGroup";

function SelectValue({ ...props }: SelectValueProps) {
  return <SelectPrimitive.Value data-slot="select-value" className="text-neutral-300 text-sm font-medium " placeholder="선택하세요" {...props} />
}

SelectValue.displayName = "SelectValue";

function SelectTrigger({ className, size = "default", children, ...props }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "w-full h-9 min-w-16 px-2.5 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-400 inline-flex justify-between items-center group rounded-[2px]",
        "focus:outline-slate-400 focus:text-zinc-700",
        "data-[state=open]:outline-slate-400",
        "data-[invalid=true]:outline-red-700 data-[invalid=true]:text-red-700",
        "disabled:bg-gray-200 disabled:outline-neutral-300 disabled:text-neutral-300",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownArrow className={cn(
          "text-neutral-300",
          "group-focus:text-zinc-700",
          "group-data-[invalid=true]:text-red-700", 
          "group-disabled:text-neutral-300"
        )} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

SelectTrigger.displayName = "SelectTrigger";

function SelectContent({ className, children, position = "popper", ...props }: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "min-w-[var(--radix-select-trigger-width)] p-2.5 bg-white rounded-[2px] !outline !outline-1 !outline-offset-[-1px] !outline-slate-400 inline-flex flex-col justify-center items-start gap-3",
          "z-50 overflow-hidden",
          position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="w-full">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

SelectContent.displayName = "SelectContent";

function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-gray-500 text-sm font-medium ", className)}
      {...props}
    />
  )
}

SelectLabel.displayName = "SelectLabel";

function SelectItem({ className, children, ...props }: SelectItemProps){
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "justify-start text-gray-500 text-sm font-medium w-full py-1 cursor-default select-none outline-none",
        "data-[highlighted]:text-zinc-700",
        "data-[state=checked]:text-blue-600",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

SelectItem.displayName = "SelectItem";

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-slate-200 my-1 h-px", className)}
      {...props}
    />
  )
}

SelectSeparator.displayName = "SelectSeparator";

function SelectScrollUpButton({ className, ...props }: SelectScrollUpButtonProps) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

SelectScrollUpButton.displayName = "SelectScrollUpButton";

function SelectScrollDownButton({ className, ...props }: SelectScrollDownButtonProps) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownArrow />
    </SelectPrimitive.ScrollDownButton>
  )
}

SelectScrollDownButton.displayName = "SelectScrollDownButton";

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}