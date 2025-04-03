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
import { DebouncedInput } from "./DebouncedInput";
import { Filter } from "./Filter";

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

  const columns: ColumnDef<Product, any>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            className="checkbox checkbox-sm"
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
              className="checkbox checkbox-sm"
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
            <button
              onClick={() => handleSave(row.id)}
              className="btn btn-sm btn-success"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => handleEdit(row.id)}
              className="btn btn-sm btn-primary"
            >
              Edit
            </button>
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
              className="checkbox checkbox-sm"
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
            className="link link-hover text-primary"
          >
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
              className="input input-sm input-bordered"
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
    <div className="p-4 max-w-full">
      <div className="form-control w-full max-w-xs mb-4">
        <label className="label" htmlFor="global-search">
          <span className="label-text">Search products</span>
        </label>
        <DebouncedInput
          id="global-search"
          data-testid="debounced-input-global"
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="input input-bordered input-sm w-full"
          placeholder="Type to filter all columns..."
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full bg-base-100 rounded-lg shadow-md">
          <thead className="bg-base-200">
            {myTable.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <FaChevronUp className="inline text-xs ml-1" />
                            ),
                            desc: (
                              <FaChevronDown className="inline text-xs ml-1" />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() &&
                        !header.column.columnDef.meta?.noFilter ? (
                          <div className="mt-1 text-sm">
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {myTable.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="text-center text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-4" />

      <div className="flex flex-wrap items-center gap-2">
        <button
          className="btn btn-sm"
          onClick={() => myTable.setPageIndex(0)}
          disabled={!myTable.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="btn btn-sm"
          onClick={() => myTable.previousPage()}
          disabled={!myTable.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="btn btn-sm"
          onClick={() => myTable.nextPage()}
          disabled={!myTable.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="btn btn-sm"
          onClick={() => myTable.setPageIndex(myTable.getPageCount() - 1)}
          disabled={!myTable.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="text-sm">
          Page{" "}
          <strong>
            {myTable.getState().pagination.pageIndex + 1} of{" "}
            {myTable.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1 text-sm">
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
            className="input input-sm input-bordered w-15"
          />
        </span>
        <select
          className="select select-sm select-bordered w-30"
          value={myTable.getState().pagination.pageSize}
          onChange={(e) => {
            myTable.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 50, 100, 200, 1000].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm mt-2">
        {myTable.getPrePaginationRowModel().rows.length} Rows
      </div>
    </div>
  );
};
