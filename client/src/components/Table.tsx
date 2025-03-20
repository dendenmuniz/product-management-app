import { useState, useMemo, InputHTMLAttributes, useEffect } from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  FilterFn,
  SortingFn,
  sortingFns,
} from "@tanstack/react-table";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";

import { Link } from "react-router-dom";
import { Product } from "../@types/types";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
    noFilter?: boolean;
  }
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }
  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export const Table = ({
  onChange,
  onSave,
  setSelectedRows,
  products,
  clearSelection,
}: {
  onChange: (
    rowId: string,
    columnId: keyof Product,
    value: string | number | boolean
  ) => void;
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
  onSave: (rowId: string) => void;
  products: Product[];
  clearSelection: boolean;
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [editableRow, setEditableRow] = useState<string | null>(null);

  const handleEdit = (rowId: string) => {
    setEditableRow(rowId);
  };

  const handleSave = (rowId: string) => {
    onSave(rowId);
    setEditableRow(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<Product, any>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) =>
          editableRow === row.id ? (
            <button onClick={() => handleSave(row.id)}>Save</button>
          ) : (
            <button onClick={() => handleEdit(row.id)}>Edit</button>
          ),
        meta: {
          noFilter: true,
        },
      },
      {
        accessorKey: "MSC",
        header: () => <span>MSC</span>,
        meta: {
          filterVariant: "select",
        },
        cell: ({ row }) =>
          editableRow === row.id ? (
            <input
              type="checkbox"
              className="w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={row.getValue("MSC")}
              onChange={(e) => onChange(row.id, "MSC", e.target.checked)}
            />
          ) : row.getValue<string>("MSC") ? (
            "Yes"
          ) : (
            "No"
          ),
      },
      {
        accessorKey: "product_name",
        filterFn: "includesString",
        sortingFn: fuzzySort,
        header: () => <span>Product</span>,
        cell: ({ row }) => (
          <Link
            to={`/products/${row.original.id}`}
            className="underline text-gray-600 hover:decoration-violet-600">
            {row.getValue("product_name")}
          </Link>
        ),
      },
      {
        accessorKey: "price",
        header: () => <span>Price</span>,
        cell: ({ row }) =>
          editableRow === row.id ? (
            <input
              type="number"
              value={row.getValue("price")}
              onChange={(e) => onChange(row.id, "price", e.target.value)}
            />
          ) : (
            row.getValue("price")
          ),
      },
      {
        accessorKey: "quantity",
        header: () => <span>Quantity</span>,
        meta: {
          filterVariant: "range",
        },
      },
      {
        accessorKey: "product_type",
        filterFn: "includesString",
        //   sortingFn: fuzzySort,
        header: () => <span>Type</span>,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "vendor",
        filterFn: "includesString",
        sortingFn: fuzzySort,
        header: () => <span>Vendor</span>,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "product_group",
        filterFn: "includesString",
        sortingFn: fuzzySort,
        header: () => <span>Group</span>,
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "department",
        filterFn: "includesString",
        sortingFn: fuzzySort,
        header: () => <span>Department</span>,
        meta: {
          filterVariant: "text",
        },
      },
    ],
    [editableRow]
  );

  const myTable = useReactTable({
    data: products,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const selectRows = myTable.getSelectedRowModel().rows;
    const selectedIds = selectRows.map((row) => row.original.id);
    setSelectedRows(selectedIds);
  }, [myTable.getSelectedRowModel().rows, setSelectedRows]);

  useEffect(() => {
    if (clearSelection) {
      setSelectedRows([]);
      myTable.resetRowSelection();
    }
  }, [clearSelection, setSelectedRows]);

  useEffect(() => {
    if (myTable.getState().columnFilters[0]?.id === "fullName") {
      if (myTable.getState().sorting[0]?.id !== "fullName") {
        myTable.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [myTable.getState().columnFilters[0]?.id]);

  return (
    <div className="p-2 overflow-auto">
      <div className="p-2 text-md w-64 text-gray-800 pb-2">
        <DebouncedInput
          data-testid="debounced-input-global"
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="p-2 shadow border border-block"
          placeholder="Search all columns..."
        />
      </div>
      <table className="table-auto overflow-auto  p-8 rounded-lg shadow-md bg-violet-50 ">
        <thead className="pl-4 pb-4 rounded-lg shadow-sm bg-violet-100">
          {myTable.getHeaderGroups().map((headerGroup) => (
            <tr className="pl-2 text-sm text-gray-800" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    className="pl-2 text-sm text-gray-800"
                    key={header.id}
                    colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none "
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <FaChevronUp className="inline text-xs m-1" />,
                            desc: (
                              <FaChevronDown className="inline text-xs m-1" />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() &&
                        !header.column.columnDef.meta?.noFilter ? (
                          <div className="p-2 text-xs text-gray-800">
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="text-sm text-gray-800">
          {myTable.getRowModel().rows.map((row) => {
            return (
              <tr
                className="hover:bg-violet-100 odd:bg-white even:bg-violet-50"
                key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td className="text-center " key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="block text-sm text-gray-800 border rounded p-1 font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
          onClick={() => myTable.setPageIndex(0)}
          disabled={!myTable.getCanPreviousPage()}>
          {"<<"}
        </button>
        <button
          className="block text-sm text-gray-800 border rounded p-1 font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
          onClick={() => myTable.previousPage()}
          disabled={!myTable.getCanPreviousPage()}>
          {"<"}
        </button>
        <button
          className="block text-sm text-gray-800 border rounded p-1 font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
          onClick={() => myTable.nextPage()}
          disabled={!myTable.getCanNextPage()}>
          {">"}
        </button>
        <button
          className="block text-sm text-gray-800 border rounded p-1 font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100"
          onClick={() => myTable.setPageIndex(myTable.getPageCount() - 1)}
          disabled={!myTable.getCanNextPage()}>
          {">>"}
        </button>
        <span className="flex items-center gap-1 text-sm text-gray-800">
          <div>Page</div>
          <strong>
            {myTable.getState().pagination.pageIndex + 1} of{" "}
            {myTable.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-800">
          | Go to page:
          <input
            type="number"
            min="1"
            max={myTable.getPageCount()}
            defaultValue={myTable.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              myTable.setPageIndex(page);
            }}
            className="border p-1 rounded w-16 text-sm text-gray-800"
          />
        </span>
        <select
          className="text-sm text-gray-800"
          value={myTable.getState().pagination.pageSize}
          onChange={(e) => {
            myTable.setPageSize(Number(e.target.value));
          }}>
          {[10, 50, 100, 200, 1000].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="text-sm text-gray-800">
        {myTable.getPrePaginationRowModel().rows.length} Rows
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}>
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="false">No</option>
      <option value="true">Yes</option>
    </select>
  ) : (
    <DebouncedInput
      className="w-32 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
    // See faceted column filters example for datalist search suggestions
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
