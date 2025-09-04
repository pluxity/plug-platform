import { cn } from "../../../utils/utils";
import { TableProps, TableHeaderProps, TableBodyProps, TableRowProps, TableHeadProps, TableCellProps, TableFooterProps, TableCaptionProps } from "./Table.types";

const tableStyles = "w-full caption-bottom text-sm";
const headerStyles = "bg-content";
const rowStyles = "flex justify-between items-center";
const headStyles = "h-9 text-gray-500 font-medium text-center justify-start flex flex-1 justify-center items-center border border-gray-point-light";
const cellStyles = "h-9 text-zinc-700 text-sm font-medium text-center justify-start border border-gray-point-light flex flex-1 items-center justify-center";

function Table({
  className,
  unstyled,
  ...props
}: TableProps) {
  return (
    <div data-slot="table-container" className="relative w-full">
      <table
        data-slot="table"
        className={cn(!unstyled && tableStyles, className)}
        {...props}
      />
    </div>
  );
}

Table.displayName = "Table";

function TableHeader({
  className,
  unstyled,
  ...props
}: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn(!unstyled && headerStyles, className)}
      {...props}
    />
  );
}

TableHeader.displayName = "TableHeader";

function TableBody({
  className,
  unstyled,
  ...props
}: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(!unstyled && "", className)}
      {...props}
    />
  );
}

TableBody.displayName = "TableBody";

function TableRow({
  className,
  unstyled,
  ...props
}: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(!unstyled && rowStyles, className)}
      {...props}
    />
  );
}

TableRow.displayName = "TableRow";

function TableHead({
  className,
  unstyled,
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(!unstyled && headStyles, className)}
      {...props}
    />
  );
}

TableHead.displayName = "TableHead";

function TableCell({
  className,
  unstyled,
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(!unstyled && cellStyles, className)}
      {...props}
    />
  );
}

TableCell.displayName = "TableCell";

function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("bg-muted/50 border-t font-medium", className)}
      {...props}
    />
  );
}

TableFooter.displayName = "TableFooter";

function TableCaption({
  className,
  ...props
}: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

TableCaption.displayName = "TableCaption";

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