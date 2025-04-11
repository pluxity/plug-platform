import React from 'react'
import { TableBodyProps } from './DataTable.types'

const TableBody = <T,>({ data, columns }: TableBodyProps<T>) => {
  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className={`${
            rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
          } hover:bg-gray-100 transition-colors`}
        >
          {columns.map((col) => (
            <td key={String(col.key)} className="p-3 border border-gray-300">
              {row[col.key] as React.ReactNode}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody