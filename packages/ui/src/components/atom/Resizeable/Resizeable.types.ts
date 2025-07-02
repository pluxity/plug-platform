import * as ResizablePrimitive from "react-resizable-panels";

export type ResizablePanelGroupProps = React.ComponentProps<typeof ResizablePrimitive.PanelGroup> & {
    children?: React.ReactNode;
    className?: string;
    direction?: "horizontal" | "vertical";
}

export interface ResizablePanelProps extends React.ComponentProps<typeof ResizablePrimitive.Panel> {
    children?: React.ReactNode;
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
    className?: string;
}   

export interface ResizableHandleProps extends React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> {
    withHandle?: boolean;
    className?: string;
    id?: string;
    disabled?: boolean;
}   
