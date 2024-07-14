import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/custom/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../data-table/data-table-view-options";
import { DataTableFacetedFilter } from "../data-table/data-table-faceted-filter";

export type FilterOption = {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchTerm: string;
  filters: FilterOption[];
}

const searchTermMapping: { [key: string]: string } = {
  address: "maintenanceRequest.propertyAddress",
  email: "email",
  date: "startDate",
};

const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Processing", value: "Processing" },
  { label: "Completed", value: "Completed" },
];

export function AdminCustomTableToolbar<TData>({
  table,
  searchTerm,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const columnAccessor = searchTermMapping[searchTerm] || searchTerm;
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {searchTerm === "status" ? (
          <select
            value={
              (table.getColumn(columnAccessor)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn(columnAccessor)
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px] bg-background text-muted-foreground border rounded-lg pl-3"
          >
            <option value="">Select Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <Input
            placeholder={`Search ${searchTerm} ...`}
            value={
              (table.getColumn(columnAccessor)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn(columnAccessor)
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        <div className="flex gap-x-2">
          {filters.map(
            (filter) =>
              table.getColumn(filter.columnId) && (
                <DataTableFacetedFilter
                  key={filter.columnId}
                  column={table.getColumn(filter.columnId)}
                  title={filter.title}
                  options={filter.options}
                />
              ),
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
