import * as React from "react";
import { cn } from "../../../utils/utils";

interface TableBaseProps {
  unstyled?: boolean;
  variant?: "default" | "custom";
}

const tableVariants = {
  default: "w-full caption-bottom text-sm",
  custom: "w-full caption-bottom text-sm",
};

const headerVariants = {
  default: "[&_tr]:border-b",
  custom: "bg-content",
};

const rowVariants = {
  default: "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
  custom: "flex justify-between items-center",
};

const headVariants = {
  default: "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap",
  custom: "h-9 text-gray-500 font-medium text-center justify-start flex flex-1 justify-center items-center border border-gray-point-light",
};

const cellVariants = {
  default: "p-2 align-middle whitespace-nowrap",
  custom: "h-9 text-zinc-700 text-sm font-medium text-center justify-start border border-gray-point-light flex flex-1 items-center justify-center",
};

function Table({
                 className,
                 unstyled,
                 variant = "default",
                 ...props
               }: React.ComponentProps<"table"> & TableBaseProps) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn(!unstyled && tableVariants[variant], className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({
                       className,
                       unstyled,
                       variant = "default",
                       ...props
                     }: React.ComponentProps<"thead"> & TableBaseProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn(!unstyled && headerVariants[variant], className)}
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
                    variant = "default",
                    ...props
                  }: React.ComponentProps<"tr"> & TableBaseProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(!unstyled && rowVariants[variant], className)}
      {...props}
    />
  );
}

function TableHead({
                     className,
                     unstyled,
                     variant = "default",
                     ...props
                   }: React.ComponentProps<"th"> & TableBaseProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(!unstyled && headVariants[variant], className)}
      {...props}
    />
  );
}

function TableCell({
                     className,
                     unstyled,
                     variant = "default",
                     ...props
                   }: React.ComponentProps<"td"> & TableBaseProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(!unstyled && cellVariants[variant], className)}
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
