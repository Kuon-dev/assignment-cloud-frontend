import { TableColumn } from "@/components/custom/data-table";

import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const statuses = [
  { value: 0, label: "Requires Payment Method", icon: QuestionMarkCircledIcon },
  { value: 1, label: "Requires Confirmation", icon: QuestionMarkCircledIcon },
  { value: 2, label: "Requires Action", icon: QuestionMarkCircledIcon },
  { value: 3, label: "Processing", icon: QuestionMarkCircledIcon },
  { value: 4, label: "Requires Capture", icon: QuestionMarkCircledIcon },
  { value: 5, label: "Cancelled", icon: CrossCircledIcon },
  { value: 6, label: "Succeeded", icon: CheckCircledIcon },
];

function getStatusTextAndClass(status: string) {
  switch (status) {
    case "RequiresPaymentMethod":
      return {
        text: "Requires Payment Method",
        className: "text-yellow-500 font-semibold",
      };
    case "RequiresConfirmation":
      return {
        text: "Requires Confirmation",
        className: "text-yellow-500 font-semibold",
      };
    case "RequiresAction":
      return {
        text: "Requires Action",
        className: "text-yellow-500 font-semibold",
      };
    case "Processing":
      return { text: "Processing", className: "text-yellow-500 font-semibold" };
    case "RequiresCapture":
      return {
        text: "Requires Capture",
        className: "text-yellow-500 font-semibold",
      };
    case "Cancelled":
      return { text: "Cancelled", className: "text-red-500 font-semibold" };
    case "Succeeded":
      return { text: "Succeeded", className: "text-green-500 font-semibold" };
    default:
      return { text: "Unknown", className: "text-gray-500 font-semibold" };
  }
}

export const columns: TableColumn<Payment>[] = [
  {
    header: "Amount (USD)",
    accessor: (row) => (row.amount / 100).toFixed(2),
  },
  {
    header: "Currency",
    accessor: (row) => row.currency.toUpperCase(),
  },
  {
    header: "Status",
    accessor: (row) => {
      const { text, className } = getStatusTextAndClass(row.status);
      return <span className={className}>{text}</span>;
    },
  },
  {
    header: "Payment Intent ID",
    accessor: (row) => row.paymentIntentId,
  },
  {
    header: "Payment Method ID",
    accessor: (row) => row.paymentMethodId || "N/A",
  },
  {
    header: "Actions",
    accessor: (row: Payment) => (
      <>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[160px] font-semibold"
            >
              <DropdownMenuItem
                disabled={row.status !== "RequiresPaymentMethod"}
              >
                <DialogTrigger>View Payment</DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            {/* <ReviewPaymentForm payment={row} /> */}
          </DialogContent>
        </Dialog>
      </>
    ),
  },
];
