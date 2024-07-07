export interface TableColumn<T> {
  header: string;
  accessor: (row: T) => JSX.Element | string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
}

export function DataTable<T>({ columns, data }: TableProps<T>) {
  return (
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-900">
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-gray-800 divide-y divide-gray-700">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                {column.accessor(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
