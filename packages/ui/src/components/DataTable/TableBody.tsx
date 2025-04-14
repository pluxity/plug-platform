import React from 'react';
import { TableBodyProps } from './DataTable.types';
import { cn } from '../../utils/classname';

const TableBody = <T,>({ data, columns, search }: TableBodyProps<T> & { search?: string }) => {
  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className={cn(
            `${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`,
            `hover:bg-gray-100 transition-colors`
          )}
        >
          {columns.map((col) => (
            <td 
              role="cell"
              key={String(col.key)} className="p-3 border border-gray-300">
              {typeof row[col.key] === 'string' && search
                ? highlightText(row[col.key] as string, search)
                : (row[col.key] as React.ReactNode)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;