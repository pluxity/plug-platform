import { ColumnDef } from "@tanstack/react-table";
import { FilterSelect } from "../../molecule/FilterBar/FilterBar.types";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pageSize?: number;
  filterColumnKey?: string;
  filterPlaceholder?: string;
  showFilter?: boolean;
  selects?: FilterSelect[];
  buttons?: React.ReactNode;
  rowSelection?: boolean;
  pageDescription?: string;
}
