import * as React from "react"
import { cn } from "../../../utils/utils"
import Left from '../../../assets/icons/pagination/left.svg'
import Right from '../../../assets/icons/pagination/right.svg'

interface PaginationProps extends React.ComponentProps<"nav"> {
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

function Pagination({ 
  className,
  ...props 
}: PaginationProps) {
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

interface PaginationContentProps extends React.ComponentProps<"div"> {
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

function PaginationContent({
  className,
  ...props
}: PaginationContentProps) {
  return (
    <div
      data-slot="pagination-content"
      className={cn("inline-flex justify-center items-center gap-5", className)}
      {...props}
    />
  )
}

type PaginationNumberProps = {
  isActive?: boolean;
  page: number;
  onClick?: (page: number) => void;
} & React.ComponentProps<"div">

function PaginationNumber({ 
  className, 
  isActive, 
  page, 
  onClick,
  ...props 
}: PaginationNumberProps) {
  return (
    <div
      data-slot="pagination-number"
      className={cn(
        "w-5 text-center justify-start text-gray-500 text-sm font-medium cursor-pointer",
        isActive && "text-zinc-700 font-extrabold",
        className
      )}
      onClick={() => onClick && onClick(page)}
      {...props}
    >
      {page}
    </div>
  )
}

type PaginationPreviousProps = {
  onClick?: () => void;
  disabled?: boolean;
} & React.ComponentProps<"div">

function PaginationPrevious({ 
  className, 
  onClick,
  disabled,
  ...props 
}: PaginationPreviousProps) {
  return (
    <div 
      data-property-1="previous"
      className={cn(
        "w-3.5 h-3.5 relative cursor-pointer", 
        disabled && "opacity-50 cursor-not-allowed",
        className
      )} 
      onClick={() => !disabled && onClick && onClick()}
      {...props}
    >
      <div className="w-2 h-3.5 left-[2.80px] top-0 absolute">
        <Left />
      </div>
    </div>
  )
}

type PaginationNextProps = {
  onClick?: () => void;
  disabled?: boolean;
} & React.ComponentProps<"div">

function PaginationNext({ 
  className, 
  onClick,
  disabled,
  ...props 
}: PaginationNextProps) {
  return (
    <div 
      data-property-1="next"
      className={cn(
        "w-3.5 h-3.5 relative cursor-pointer", 
        disabled && "opacity-50 cursor-not-allowed",
        className
      )} 
      onClick={() => !disabled && onClick && onClick()}
      {...props}
    >
      <div className="w-2 h-3.5 left-[11.20px] absolute origin-top-left">
        <Right />
      </div>
    </div>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationNumber,
  PaginationPrevious,
  PaginationNext,
}