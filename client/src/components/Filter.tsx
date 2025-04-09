import { Column } from "@tanstack/react-table";
import { DebouncedInput } from "./DebouncedInput";

// Você pode tipar melhor se tiver um tipo customizado para suas colunas
export const Filter = ({ column }: { column: Column<any, unknown> }) => {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <div className="flex space-x-2">
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder="Min"
        className="input input-sm input-bordered w-24"
      />
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder="Max"
        className="input input-sm input-bordered w-24"
      />
    </div>
  ) : filterVariant === "select" ? (
    <select
      className="select select-sm select-bordered"
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      <option value="false">No</option>
      <option value="true">Yes</option>
    </select>
  ) : (
    <DebouncedInput
      className="input input-sm input-bordered w-32"
      onChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
};
