import * as SwitchPrimitive from "@radix-ui/react-switch";

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
