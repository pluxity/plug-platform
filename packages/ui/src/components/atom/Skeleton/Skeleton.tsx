import { cn } from "../../../utils/utils";
import { SkeletonProps } from "./Skeleton.types";

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div  
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

Skeleton.displayName = "Skeleton";

export { Skeleton }
