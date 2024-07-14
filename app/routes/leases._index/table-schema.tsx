import { useState } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { TableColumn } from "@/components/custom/data-table";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import LeaseForm from "@/components/lease/form/lease-form";
import MaintenanceRequestForm from "@/components/maintenance/form/maintenance-request-form";
import PaymentForm from "@/components/payment/form/payment-form";

export const columns: TableColumn<Lease>[] = [
  {
    header: "Property Address",
    accessor: (row) => row.property.address,
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
    header: "Status",
    accessor: (row) =>
      row.isActive ? (
        <span className="text-green-500 font-semibold">Active</span>
      ) : (
        <span className="text-red-500 font-semibold">Inactive</span>
      ),
  },
  {
    header: "Actions",
    accessor: (row) => <ActionsCell row={row} />,
  },
];

const ActionsCell: React.FC<{ row: Lease }> = ({ row }) => {
  const [dialogContent, setDialogContent] = useState<
    "review" | "delete" | "maintenance" | "payment" | null
  >(null);
  const user = useDashboardStore((state) => state.user);
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);

  const onSubmit = async (lease: Lease) => {
    const res = await fetch(
      `${window.ENV?.BACKEND_URL}/api/Leases/${lease.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      },
    );

    if (res.ok) {
      toast.success("Lease deleted successfully!");
    } else {
      const error = await res.json();
      toast.error(error.data.message);
    }
  };

  return (
    <>
      <Dialog
        open={dialogContent !== null}
        onOpenChange={(open) => !open && setDialogContent(null)}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] font-semibold">
            <DropdownMenuItem onClick={() => setDialogContent("review")}>
              Review Lease
            </DropdownMenuItem>
            {user?.admin && (
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => setDialogContent("delete")}
              >
                Delete
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setDialogContent("maintenance")}>
              Maintenance Request
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDialogContent("payment")}>
              Payment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          {dialogContent === "review" && (
            <LeaseForm
              tenantId={row.tenantId}
              propertyId={row.propertyId}
              lease={row}
            />
          )}
          {dialogContent === "delete" && (
            <div className="rounded-md shadow-md">
              <p className="text-lg font-semibold mb-4">
                Are you sure you want to delete this lease?
              </p>
              <div className="flex gap-4">
                <Button
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => onSubmit(row)}
                >
                  Confirm
                </Button>
                <Button
                  className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                  onClick={() => setDialogContent(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {dialogContent === "maintenance" && (
            <MaintenanceRequestForm propertyId={row.propertyId} />
          )}
          {dialogContent === "payment" && <PaymentForm lease={row} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
