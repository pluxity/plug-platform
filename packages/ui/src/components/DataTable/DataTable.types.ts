export interface Column<T> {
    key: keyof T
    label: string
  }
  
  export interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    pageSize: number
    serverSide?: boolean
    onPageChange?: (page: number, pageSize: number) => void
    filterFunction?: (item: T, search: string) => boolean
  }
  
  export interface PaginationProps {
    currentPage?: number
    totalPages?: number
    pageCount?: number
    onPageChange: (page: number) => void
  }
  
  export interface SearchFilterProps {
    search: string
    onSearchChange: (value: string) => void
  }
  
  export interface TableHeaderProps<T> {
    columns: Column<T>[]
    sortKey: keyof T | null
    sortOrder: 'asc' | 'desc'
    onSort: (key: keyof T) => void
  }
  
  export interface TableBodyProps<T> {
    data: T[]
    columns: Column<T>[]
  }