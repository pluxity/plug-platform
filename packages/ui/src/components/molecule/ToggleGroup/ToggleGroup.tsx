import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { ToggleVariants } from "../../atom/Toggle/Toggle";
import { cn } from "../../../utils/utils";
import { createContext, useContext } from "react";
import { ToggleGroupContextValue, ToggleGroupProps, ToggleGroupItemProps } from "./ToggleGroup.types";

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
})

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/Toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

ToggleGroup.displayName = "ToggleGroup";
function ToggleGroupItem({
                           className,
                           children,
                           variant,
                           size,
                           ...props
                         }: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        ToggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem }
