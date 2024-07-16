import { useState } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { TableColumn } from "@/components/custom/data-table";
import { toast } from "sonner";

import ReviewApplicationForm from "@/components/rental/form/review-rental-application";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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

export const ownerColumns = (
  fetchApplications: () => void,
): TableColumn<Application>[] => [
  {
    header: "Property Address",
    accessor: (row) => row.listingAddress,
  },
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
      <ActionsCell row={row} fetchApplications={fetchApplications} />
    ),
  },
];

export const tenantColumns = (
  fetchApplications: () => void,
): TableColumn<Application>[] => [
  {
    header: "Property Address",
    accessor: (row) => row.listingAddress,
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
      <ActionsCell row={row} fetchApplications={fetchApplications} />
    ),
  },
];

type ActionsCellProps = {
  row: Application;
  fetchApplications: () => void;
};

const ActionsCell: React.FC<ActionsCellProps> = ({
  row,
  fetchApplications,
}) => {
  const [dialogContent, setDialogContent] = useState<
    "review" | "delete" | null
  >(null);
  const user = useDashboardStore((state) => state.user);
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);

  const onSubmit = async (application: Application) => {
    const res = await fetch(
      `${window.ENV?.BACKEND_URL}/api/Applications/${application.id}`,
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
      fetchApplications();
      toast.success("Application deleted successfully!");
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
              Review Application
            </DropdownMenuItem>
            {user?.admin && (
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => setDialogContent("delete")}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          {dialogContent === "review" && (
            <ReviewApplicationForm
              application={row}
              fetchApplications={fetchApplications}
            />
          )}
          {dialogContent === "delete" && (
            <div className="rounded-md shadow-md">
              <p className="text-lg font-semibold mb-4">
                Are you sure you want to delete this application?
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
        </DialogContent>
      </Dialog>
    </>
  );
};
