import React from "react";

interface TableColumn<T> {
  key: string | number;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  idKey?: string | number;
  loading?: boolean;
}

const CustomTable = <T extends Record<string, any>>({
  columns,
  data,
  onEdit,
  onDelete,
  idKey = "id",
  loading = false,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl shadow-lg p-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 text-left text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                <b>{col.label}</b>
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-800 dark:text-gray-200">
                <b>Actions</b>
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[idKey])}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? "")}
                  </td>
                ))}

                {(onEdit || onDelete) && (
                  <td className="px-4 py-2 flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="px-3 py-1 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
