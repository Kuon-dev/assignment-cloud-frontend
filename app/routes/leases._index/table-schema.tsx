import { TableColumn } from "@/components/custom/data-table";

export const columns: TableColumn<Lease>[] = [
  {
    header: "Property Name",
    accessor: (row) => row.propertyName,
  },
  {
    header: "Start Date",
    accessor: (row) =>
      new Date(row.startDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    header: "End Date",
    accessor: (row) =>
      new Date(row.endDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    header: "Rent Amount",
    accessor: (row) => `$${row.rentAmount.toFixed(2)}`,
  },
  {
    header: "Security Deposit",
    accessor: (row) => `$${row.securityDeposit.toFixed(2)}`,
  },
  {
    header: "Active",
    accessor: (row) =>
      row.isActive ? (
        <span className="text-green-500 font-semibold">Active</span>
      ) : (
        <span className="text-red-500 font-semibold">Inactive</span>
      ),
  },
  {
    header: "Application Date",
    accessor: (row) =>
      new Date(row.applicationDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
];
