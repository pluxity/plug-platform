export interface ButtonProps extends React.ComponentProps<"button"> {
    asChild?: boolean;
    children?: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    onBackground?: boolean;
    className?: string;
    disabled?: boolean;
}
