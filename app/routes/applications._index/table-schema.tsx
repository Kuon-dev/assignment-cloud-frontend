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
import RentalApplicationForm from "@/components/rental/form/rental-application-form";

export const statuses = [
  { value: 0, label: "Pending", icon: QuestionMarkCircledIcon },
  { value: 1, label: "Approved", icon: CheckCircledIcon },
  { value: 2, label: "Rejected", icon: CrossCircledIcon },
];

function getStatusTextAndClass(status: string) {
  switch (status) {
    case "0":
      return { text: "Pending", className: "text-yellow-500 font-semibold" };
    case "1":
      return { text: "Approved", className: "text-green-500 font-semibold" };
    case "2":
      return { text: "Rejected", className: "text-red-500 font-semibold" };
    default:
      return { text: "Unknown", className: "text-gray-500 font-semibold" };
  }
}

export const columns: TableColumn<Application>[] = [
  {
    header: "Tenant First Name",
    accessor: (row) => row.tenantFirstName,
  },
  {
    header: "Tenant Last Name",
    accessor: (row) => row.tenantLastName,
  },
  {
    header: "Tenant Email",
    accessor: (row) => row.tenantEmail,
  },
  {
    header: "Status",
    accessor: (row) => {
      const { text, className } = getStatusTextAndClass(row.status.toString());
      return <span className={className}>{text}</span>;
    },
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
  {
    header: "Actions",
    accessor: (row) => (
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
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem>
                <DialogTrigger>Edit Application</DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <RentalApplicationForm tenantId="" listingId="" />
          </DialogContent>
        </Dialog>
      </>
    ),
  },
];
