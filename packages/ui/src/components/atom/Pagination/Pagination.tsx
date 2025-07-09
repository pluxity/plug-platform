import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "../../../utils/utils";
import { buttonVariants } from "../Button/Button";
import { PaginationProps, PaginationContentProps, PaginationItemProps, PaginationLinkProps, PaginationPreviousProps, PaginationNextProps, PaginationEllipsisProps } from "./Pagination.types";

function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

Pagination.displayName = "Pagination";

function PaginationContent({
                             className,
                             ...props
                           }: PaginationContentProps) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

PaginationContent.displayName = "PaginationContent";

function PaginationItem({ ...props }: PaginationItemProps) {
  return <li data-slot="pagination-item" {...props} />
}

PaginationItem.displayName = "PaginationItem";

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: "ghost",
          size
        }),
        "hover:bg-transparent hover:text-black cursor-pointer text-gray w-6 h-6",
        isActive && "text-black font-bold",
        className
      )}
      {...props}
    />
  )
}

PaginationLink.displayName = "PaginationLink";

function PaginationPrevious({ className, ...props }: PaginationPreviousProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-5" />
      <span className="hidden">Prev</span>
    </PaginationLink>
  )
}

PaginationPrevious.displayName = "PaginationPrevious";

function PaginationNext({ className, ...props }: PaginationNextProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden">Next</span>
      <ChevronRightIcon className="size-5" />
    </PaginationLink>
  )
}

PaginationNext.displayName = "PaginationNext";

function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
