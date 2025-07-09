import * as ProgressPrimitive from "@radix-ui/react-progress";

export interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
    className?: string;
    value?: number;
}

