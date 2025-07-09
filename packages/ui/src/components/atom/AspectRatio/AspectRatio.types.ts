import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

export interface AspectRatioProps extends React.ComponentProps<typeof AspectRatioPrimitive.Root> {
    ratio?: number;
    children?: React.ReactNode;
}


