
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

export interface RadioGroupProps extends RadioGroupPrimitive.RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

export interface RadioGroupItemProps extends RadioGroupPrimitive.RadioGroupItemProps {
  id?: string;
  value: string;
}
