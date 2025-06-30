export interface BadgeProps extends React.ComponentProps<"span">{
    asChild?: boolean;
    children?: React.ReactNode;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
}



