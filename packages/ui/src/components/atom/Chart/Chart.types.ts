import * as React from "react";
import * as RechartsPrimitive from "recharts";

// Format: { THEME_NAME: CSS_SELECTOR }
export const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

export interface ChartContextProps {
  config: ChartConfig;
}

export interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}

export interface ChartStyleProps {
  id: string;
  config: ChartConfig;
}

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    name?: string;
    dataKey?: string;
    color?: string;
    payload?: Record<string, unknown>;
  }>;
  className?: string;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: string | number;
  labelFormatter?: (value: React.ReactNode, payload: ChartTooltipContentProps["payload"]) => React.ReactNode;
  labelClassName?: string;
  formatter?: (value: number, name: string, props: { value?: number; name?: string; dataKey?: string; color?: string; payload?: Record<string, unknown> }, index: number, payload: ChartTooltipContentProps["payload"]) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
}

export interface ChartLegendContentProps extends React.ComponentProps<"div">,
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> {
  hideIcon?: boolean;
  nameKey?: string;
}
