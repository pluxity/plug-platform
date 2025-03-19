export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "circle" | "rectangle" | "text";
    className?: string;
}