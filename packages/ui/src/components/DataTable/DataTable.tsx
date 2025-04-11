import { useState, useMemo } from 'react'
import { DataTableProps } from './DataTable.types'
import TableHeader from './TableHeader'
import TableBody from './TableBody'
import Pagination from './Pagination'
import SearchFilter from './SearchFilter'

const DataTable = <T,>({
  data,
  columns,
  pageSize,
  serverSide = false,
  onPageChange,
  filterFunction,
  showSearch = false,
}: DataTableProps<T> & { showSearch?: boolean }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [search, setSearch] = useState('')

  const filteredAndSortedData = useMemo(() => {
    let filteredData = data
    if (search && filterFunction) {
      filteredData = filteredData.filter((item) => filterFunction(item, search))
    }
    if (sortKey) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortKey]
        const bValue = b[sortKey]
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }
    return filteredData
  }, [data, sortKey, sortOrder, search, filterFunction])

  const paginatedData = useMemo(() => {
    if (serverSide) return filteredAndSortedData
    const startIndex = (currentPage - 1) * pageSize
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize)
  }, [filteredAndSortedData, currentPage, pageSize, serverSide])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (serverSide && onPageChange) {
      onPageChange(page, pageSize)
    }
  }

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-300 p-4">
      {showSearch && ( // Conditionally render the search field
        <SearchFilter search={search} onSearchChange={setSearch} />
      )}
      <table className="min-w-full table-auto border-collapse text-sm text-left text-gray-700">
        <TableHeader columns={columns} sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
        <TableBody data={paginatedData} columns={columns} />
      </table>
      {!serverSide && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredAndSortedData.length / pageSize)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default DataTable