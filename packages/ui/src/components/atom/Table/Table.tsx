import * as React from "react";
import { cn } from "../../../utils/utils";

interface TableBaseProps {
  unstyled?: boolean;
}

const tableStyles = "w-full caption-bottom text-sm";
const headerStyles = "bg-content";
const rowStyles = "flex justify-between items-center";
const headStyles = "h-9 text-gray-500 font-medium text-center justify-start flex flex-1 justify-center items-center border border-gray-point-light";
const cellStyles = "h-9 text-zinc-700 text-sm font-medium text-center justify-start border border-gray-point-light flex flex-1 items-center justify-center";

function Table({
  className,
  unstyled,
  ...props
}: React.ComponentProps<"table"> & TableBaseProps) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn(!unstyled && tableStyles, className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  className,
  unstyled,
  ...props
}: React.ComponentProps<"thead"> & TableBaseProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn(!unstyled && headerStyles, className)}
      {...props}
    />
  );
}

function TableBody({
  className,
  unstyled,
  ...props
}: React.ComponentProps<"tbody"> & TableBaseProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(!unstyled && "", className)}
      {...props}
    />
  );
}

function TableRow({
  className,
  unstyled,
  ...props
}: React.ComponentProps<"tr"> & TableBaseProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(!unstyled && rowStyles, className)}
      {...props}
    />
  );
}

function TableHead({
  className,
  unstyled,
  ...props
}: React.ComponentProps<"th"> & TableBaseProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(!unstyled && headStyles, className)}
      {...props}
    />
  );
}

function TableCell({
  className,
  unstyled,
  ...props
}: React.ComponentProps<"td"> & TableBaseProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(!unstyled && cellStyles, className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("bg-muted/50 border-t font-medium", className)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};