import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, PaginationState, useReactTable } from "@tanstack/react-table"
import { ArrowLeft2, ArrowRight2 } from "iconsax-react"
import { useState } from "react"
import ReactPaginate from "react-paginate"

const Table: React.FC<{ data: unknown[], columns: ColumnDef<unknown, never>[] }> = ({ data, columns }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<unknown, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination
    }
  })

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} scope="col" className="px-4 py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b dark:border-gray-700">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          {"Exibindo "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {table.getRowModel().rows.length > 0 ? table.getRowModel().rows[0].index + 1 : 0}
            -
            {table.getRowModel().rows.length > 0 ? table.getRowModel().rows[table.getRowModel().rows.length - 1].index + 1 : 0}
          </span>
          {" de "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {table.getRowCount().toLocaleString()}
          </span>
        </span>
        <ReactPaginate
          pageCount={table.getPageCount()}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          previousLabel={(
            <div className="w-full h-full py-2 px-3">
              <ArrowLeft2 size={16} />
            </div>
          )}
          nextLabel={
            <div className="w-full h-full py-2 px-3">
              <ArrowRight2 size={16} />
            </div>
          }
          breakLabel={<span className="text-sm">...</span>}
          containerClassName="flex items-center"
          pageLinkClassName="text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          activeLinkClassName="text-sm py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          previousClassName="flex items-center justify-center ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          nextClassName="flex items-center justify-center ml-0 text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          breakClassName="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          onPageChange={({ selected }) => setPagination({ ...pagination, pageIndex: selected })}
        />
      </nav>
    </>
  )
}

export default Table
