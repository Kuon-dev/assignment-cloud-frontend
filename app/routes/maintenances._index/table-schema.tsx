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
import MaintenanceRequestForm from "@/components/maintenance/form/maintenance-request-form";
import MaintenanceTaskForm from "@/components/maintenance/form/maintenance-task-form";

function getStatusTextAndClass(status: number) {
  switch (status) {
    case 0:
      return { text: "Pending", className: "text-yellow-500 font-semibold" };
    case 1:
      return { text: "In Progress", className: "text-blue-500 font-semibold" };
    case 2:
      return { text: "Completed", className: "text-green-500 font-semibold" };
    case 3:
      return { text: "Cancelled", className: "text-red-500 font-semibold" };
    default:
      return { text: "Unknown", className: "text-gray-500 font-semibold" };
  }
}

export const columns: TableColumn<Maintenance>[] = [
  {
    header: "Created At",
    accessor: (row) =>
      new Date(row.maintenanceRequest.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    header: "Property Address",
    accessor: (row) => row.maintenanceRequest.propertyAddress,
  },
  {
    header: "Status",
    accessor: (row) => {
      const { text, className } = getStatusTextAndClass(
        parseInt(row.maintenanceRequest.status),
      );
      return <span className={className}>{text}</span>;
    },
  },
  {
    header: "Actions",
    accessor: (row) => <ActionsCell row={row} />,
  },
];

const ActionsCell: React.FC<{ row: Maintenance }> = ({ row }) => {
  const [dialogContent, setDialogContent] = useState<
    "review" | "delete" | null
  >(null);
  const user = useDashboardStore((state) => state.user);
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);

  const onSubmit = async (maintenance: Maintenance) => {
    const res = await fetch(
      `${window.ENV?.BACKEND_URL}/api/Maintenances/${maintenance.id}`,
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
      toast.success("Maintenance request deleted successfully!");
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
              Review Maintenance
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

        <DialogContent className="max-h-96 my-6 mb-10 overflow-auto custom-scrollbar">
          {dialogContent === "review" &&
            (user?.role === 1 ? ( // Assuming role 1 is the owner role
              <MaintenanceTaskForm maintenance={row} isAdmin={false} />
            ) : (
              <MaintenanceRequestForm maintenance={row} />
            ))}
          {dialogContent === "delete" && (
            <div className="rounded-md shadow-md">
              <p className="text-lg font-semibold mb-4">
                Are you sure you want to delete this maintenance request?
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
const customScrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar{
        width: 6px;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track{
        background: none;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb{ 
        background: rgb(255 255 255 / 10%);
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover{ 
        background: rgb(255 255 255 / 15%);
    }
`;

if (typeof window !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = customScrollbarStyles;
  document.head.appendChild(styleElement);
}
