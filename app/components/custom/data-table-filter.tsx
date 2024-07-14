import React, { useState, useEffect } from "react";

interface TableFilterProps<T> {
  data: T[];
  filterFunction: (item: T, filter: string) => boolean;
  onFilter: (filteredData: T[]) => void;
  filterOptions: { value: string; label: string }[];
  defaultFilter?: string;
}

export function TableFilter<T>({
  data,
  filterFunction,
  onFilter,
  filterOptions,
  defaultFilter = "all",
}: TableFilterProps<T>) {
  const [filter, setFilter] = useState(defaultFilter);

  useEffect(() => {
    const filteredData = data.filter((item) => filterFunction(item, filter));
    onFilter(filteredData);
  }, [data, filter]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="status-filter" className="mr-2">
        Filter by Status:
      </label>
      <select
        id="status-filter"
        value={filter}
        onChange={handleFilterChange}
        className="p-2 border rounded bg-black"
      >
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value} className="bg-black">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
