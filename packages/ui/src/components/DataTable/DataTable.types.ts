export interface Column<T> {
    key: keyof T
    label: string
  }
  
  export interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    pageSize?: number
    pageBlock?: number
    onPageChange?: (page: number, pageSize: number) => void
    filterFunction?: (item: T, search: string) => boolean
    showSearch?: boolean
    showPagination?: boolean
  }
  
  export interface PaginationProps {
    currentPage?: number
    totalPages?: number
    pageBlock?: number
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
    search?: string; // 검색어 추가
  }