import * as TabsPrimitive from "@radix-ui/react-tabs";

export interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {
  className?: string;
  children?: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  className?: string;
  unstyled?: boolean;
  children?: React.ReactNode;
}

export interface TabsTriggerProps extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  className?: string;
  unstyled?: boolean;
  value: string;
  key?: string;
  children?: React.ReactNode;
}

export interface TabsContentProps extends React.ComponentProps<typeof TabsPrimitive.Content> {
  className?: string;
  value: string;
  key?: string;
  children?: React.ReactNode;
}
