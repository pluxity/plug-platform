import { useState, useMemo } from 'react';
import { DataTableProps } from './DataTable.types';
import { Pagination } from '../Pagination';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import SearchFilter from './SearchFilter';

const DataTable = <T,>({
    data,
    columns,
    pageSize = 5,
    pageBlock = 10,
    onPageChange,
    filterFunction,
    showSearch = false,
    showPagination = true,
    selectable = false,
    onSelectChange,
    selectedRows = new Set<T>(),
  }: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [isSelectedRows, setIsSelectedRows] = useState<Set<T>>(new Set());

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;
    if (search && filterFunction) {
      filtered = filtered.filter((item) => filterFunction(item, search));
    }
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, sortKey, sortOrder, search, filterFunction]);

  const paginatedData = useMemo(() => {
    if (!showPagination) return filteredAndSortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize, showPagination]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page, pageSize);
  };

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const isControlled = selectedRows !== undefined;
  const currentSelected = isControlled ? selectedRows : isSelectedRows;
  
  const selectedChange = (newSelected: Set<T>) => {
    if (!isControlled) {
      setIsSelectedRows(newSelected);
    }
    onSelectChange?.(newSelected);
  }

  const selectedAll = currentSelected.size === data.length;

  const handleSelectAll = () => {
    const newSelected = selectedAll ? new Set<T>() : new Set(data);
    selectedChange(newSelected);
  }

  const handleSelectRow = (row: T) => {
    const newSelected = new Set(currentSelected);
    if(newSelected.has(row)){
      newSelected.delete(row);
    }else{
      newSelected.add(row);
    }
    selectedChange(newSelected);
  };

  return (
      <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm p-4">
        {showSearch && (
            <SearchFilter search={search} onSearchChange={setSearch} />
        )}
        <table className="min-w-full text-sm text-left text-slate-700 border-separate border-spacing-0">
          <TableHeader columns={columns} sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} selectable={selectable} selectedAll={selectedAll} onSelectChange={handleSelectAll}/>
          <TableBody data={paginatedData} columns={columns} search={search} selectable={selectable} selectedRows={currentSelected} onSelectChange={handleSelectRow}/>
        </table>
        {showPagination && (
            <div className="mt-4 flex justify-center">
              <Pagination
                  currentPage={currentPage}
                  pageBlock={pageBlock}
                  totalPages={Math.ceil(filteredAndSortedData.length / pageSize)}
                  onPageChange={handlePageChange}
              />
            </div>
        )}
      </div>
  );
};

DataTable.displayName = 'DataTable';

export { DataTable };
