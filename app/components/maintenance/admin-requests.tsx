import React, { useEffect, useState } from "react";
import { FilterOption } from "../custom/admin-custom-table-toolbar";
import { AdminCustomTable } from "../custom/admin-custom-table";
import { ColumnDef } from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import MaintenanceTaskForm from "./form/maintenance-task-form";

interface MaintenanceRequestWithTasks {
  id: string;
  tenantId: string;
  propertyId: string;
  description: string;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
  propertyAddress: string;
  tenantFirstName: string;
  tenantLastName: string;
  tenantEmail: string;
  tasks: MaintenanceTask[];
}

interface MaintenanceTask {
  id: string;
  requestId: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  startDate: string;
  completionDate: string;
  status: string;
}

const columns = (
  handleDelete: (maintenanceId: string) => void,
  handleUpdate: (updatedData: MaintenanceRequestWithTasks) => void,
): ColumnDef<MaintenanceRequestWithTasks>[] => [
  {
    accessorKey: "maintenanceRequest.description",
    header: "Description",
    cell: ({ cell }) => (
      <DescriptionCell description={cell.getValue() as string} />
    ),
  },
  {
    accessorKey: "maintenanceRequest.status",
    header: "Status",
    cell: ({ cell }) => {
      const { text, className } = getStatusTextAndClass(cell.getValue());
      return <span className={className}>{text}</span>;
    },
  },
  {
    accessorKey: "maintenanceRequest.createdAt",
    header: "Created At",
    cell: ({ cell }) =>
      new Date(cell.getValue()).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    accessorKey: "maintenanceRequest.propertyAddress",
    header: "Property Address",
  },
  {
    accessorKey: "maintenanceRequest.tenantEmail",
    header: "Tenant Email",
  },
  {
    accessorKey: "tasks.0.estimatedCost",
    header: "Estimated Cost",
    cell: ({ cell }) => `$${cell.getValue()?.toFixed(2) || "N/A"}`,
  },
  {
    accessorKey: "tasks.0.actualCost",
    header: "Actual Cost",
    cell: ({ cell }) => `$${cell.getValue()?.toFixed(2) || "N/A"}`,
  },
  {
    accessorKey: "tasks.0.startDate",
    header: "Start Date",
    cell: ({ cell }) =>
      cell.getValue()
        ? new Date(cell.getValue()).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "N/A",
  },
  {
    accessorKey: "tasks.0.completionDate",
    header: "Completion Date",
    cell: ({ cell }) =>
      cell.getValue()
        ? new Date(cell.getValue()).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "N/A",
  },
  {
    header: "Actions",
    cell: ({ row }) => (
      <ActionsCell
        row={row.original}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />
    ),
  },
];

const getStatusTextAndClass = (status: number) => {
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
};

const DescriptionCell: React.FC<{ description?: string }> = ({
  description,
}) => {
  const [expanded, setExpanded] = useState(false);
  const maxHeight = 60; // Set the max height for the description

  if (!description) {
    return <div>No description available</div>;
  }

  return (
    <div>
      <div
        style={{
          maxHeight: expanded ? "none" : `${maxHeight}px`,
          overflow: "hidden",
        }}
      >
        {description}
      </div>
      {description.length > maxHeight && (
        <Button
          variant="link"
          onClick={() => setExpanded(!expanded)}
          className="pl-0"
        >
          {expanded ? "See less" : "See more"}
        </Button>
      )}
    </div>
  );
};

const ActionsCell: React.FC<{
  row: MaintenanceRequestWithTasks;
  handleDelete: (maintenanceId: string) => void;
  handleUpdate: (updatedData: MaintenanceRequestWithTasks) => void;
}> = ({ row, handleDelete, handleUpdate }) => {
  const [dialogContent, setDialogContent] = useState<"edit" | "delete" | null>(
    null,
  );

  const handleSuccess = (updatedData: MaintenanceRequestWithTasks) => {
    handleUpdate(updatedData);
    setDialogContent(null); // Close the dialog
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
            <DropdownMenuItem onClick={() => setDialogContent("edit")}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => setDialogContent("delete")}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="max-h-96 my-6 mb-10 overflow-auto custom-scrollbar">
          {dialogContent === "edit" && (
            <>
              <DialogTitle>Edit Maintenance Request</DialogTitle>
              <DialogDescription>
                Edit the maintenance request details below.
              </DialogDescription>
              <MaintenanceTaskForm
                maintenance={row}
                onSuccess={handleSuccess}
              />
            </>
          )}
          {dialogContent === "delete" && (
            <>
              <DialogTitle>Delete Maintenance Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this maintenance request?
              </DialogDescription>
              <div className="rounded-md shadow-md">
                <div className="flex gap-4">
                  <Button
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDelete(row.maintenanceRequest.id)}
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

interface MaintenanceProps {
  searchTerm: string;
  data: MaintenanceRequestWithTasks[];
  filters: FilterOption[];
  pageIndex: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalPages: number;
  setPageIndex: (pageIndex: number) => void;
  handleDelete: (maintenanceId: string) => void;
}

export default function AdminMaintenanceComponent({
  searchTerm,
  data,
  filters,
  pageIndex,
  pageSize,
  setPageSize,
  totalPages,
  setPageIndex,
  handleDelete,
}: MaintenanceProps) {
  const [tableData, setTableData] = useState(data);
  const handleUpdate = (updatedData: MaintenanceRequestWithTasks) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.maintenanceRequest.id === updatedData.maintenanceRequest.id
          ? {
              ...item,
              maintenanceRequest: {
                ...item.maintenanceRequest,
                description:
                  updatedData.maintenanceRequest.description ??
                  item.maintenanceRequest.description,
                status:
                  updatedData.maintenanceRequest.status ??
                  item.maintenanceRequest.status,
              },
              tasks: [
                {
                  ...item.tasks[0],
                  description:
                    updatedData.maintenanceTask.description ??
                    item.tasks[0].description,
                  estimatedCost:
                    updatedData.maintenanceTask.estimatedCost ??
                    item.tasks[0].estimatedCost,
                  actualCost:
                    updatedData.maintenanceTask.actualCost ??
                    item.tasks[0].actualCost,
                  startDate:
                    updatedData.maintenanceTask.startDate ??
                    item.tasks[0].startDate,
                  completionDate:
                    updatedData.maintenanceTask.completionDate ??
                    item.tasks[0].completionDate,
                  status:
                    updatedData.maintenanceTask.status ?? item.tasks[0].status,
                },
              ],
            }
          : item,
      ),
    );
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <section className="w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Maintenance Requests</h1>
      </div>
      <AdminCustomTable
        searchTerm={searchTerm}
        columns={columns(handleDelete, handleUpdate)}
        data={tableData}
        filters={filters}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        setPageIndex={setPageIndex}
      />
    </section>
  );
}

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
