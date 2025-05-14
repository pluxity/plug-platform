import { TableHeaderProps } from './DataTable.types'

const TableHeader = <T,>({
  columns,
  sortKey,
  sortOrder,
  onSort,
}: TableHeaderProps<T>) => {
  return (
    <thead className="bg-gray-200 text-gray-800 uppercase text-xs font-semibold">
      <tr>
        {columns.map((col) => (
          <th
            scope="col"
            key={String(col.key)}
            className="p-3 border border-gray-300 cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={() => onSort(col.key)}
            aria-sort={sortKey === col.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            {col.label}
            {sortKey === col.key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader