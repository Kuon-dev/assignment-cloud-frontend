import { TableColumn } from "@/components/custom/data-table";

function getStatusTextAndClass(status: number) {
  switch (status) {
    case 0:
      return {
        text: "Requires Payment Method",
        className: "text-yellow-500 font-semibold",
      };
    case 1:
      return {
        text: "Requires Confirmation",
        className: "text-yellow-500 font-semibold",
      };
    case 2:
      return {
        text: "Requires Action",
        className: "text-yellow-500 font-semibold",
      };
    case 3:
      return { text: "Processing", className: "text-yellow-500 font-semibold" };
    case 4:
      return {
        text: "Requires Capture",
        className: "text-yellow-500 font-semibold",
      };
    case 5:
      return { text: "Cancelled", className: "text-red-500 font-semibold" };
    case 6:
      return { text: "Succeeded", className: "text-green-500 font-semibold" };
    default:
      return { text: "Unknown", className: "text-gray-500 font-semibold" };
  }
}

export const columns: TableColumn<Payment>[] = [
  {
    header: "Amount",
    accessor: (row) => row.amount.toFixed(2),
  },
  {
    header: "Currency",
    accessor: (row) => row.currency.toUpperCase(),
  },
  {
    header: "Payment Date",
    accessor: (row) =>
      new Date(row.paymentDate).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
  },
  {
    header: "Status",
    accessor: (row) => {
      const { text, className } = getStatusTextAndClass(row.status);
      return <span className={className}>{text}</span>;
    },
  },
];

function getPayoutStatusTextAndClass(status: string) {
  switch (status) {
    case "Processing":
      return {
        text: "Processing",
        className: "text-yellow-500 font-semibold",
      };
    case "Succeeded":
      return {
        text: "Suceess",
        className: "text-green-500 font-semibold",
      };
    case "Failed":
      return {
        text: "Failed",
        className: "text-red-500 font-semibold",
      };
    default:
      return {
        text: "Unknown",
        className: "text-gray-500 font-semibold",
      };
  }
}

export const OwnerColumns: TableColumn<Payout>[] = [
  {
    header: "Amount",
    accessor: (row) => row.amount.toFixed(2),
  },
  {
    header: "Currency",
    accessor: (row) => row.currency.toUpperCase(),
  },
  {
    header: "Payment Date",
    accessor: (row) =>
      new Date(row.createdAt).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
  },
  {
    header: "Status",
    accessor: (row) => {
      const { text, className } = getPayoutStatusTextAndClass(
        row.status.toString(),
      );
      return <span className={className}>{text}</span>;
    },
  },
  {
    header: "Property Address",
    accessor: (row) => row.propertyAddress,
  },
  {
    header: "Tenant Name",
    accessor: (row) => row.tenantName,
  },
];
