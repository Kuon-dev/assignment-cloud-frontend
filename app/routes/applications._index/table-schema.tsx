import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export const statuses = [
  { label: "Pending", value: "Pending", icon: QuestionMarkCircledIcon },
  { label: "Approved", value: "Approved", icon: CheckCircledIcon },
  { label: "Rejected", value: "Rejected", icon: CrossCircledIcon },
];

export const applicationSchema = z.object({
  tenantId: z.string().uuid().nonempty("Tenant ID is required"),
  listingId: z.string().uuid().nonempty("Listing ID is required"),
  status: z.enum(["Pending", "Approved", "Rejected"]),
  applicationDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  employmentInfo: z.string().optional(),
  references: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;

export const columns: ColumnDef<ApplicationSchema>[] = [
  {
    accessorKey: "tenantId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tenant ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] max-w-[80px] truncate">
        {row.getValue("tenantId")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "listingId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Listing ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] max-w-[80px] truncate">
        {row.getValue("listingId")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "applicationDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Application Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] max-w-[120px] truncate">
        {row.getValue("applicationDate")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "employmentInfo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employment Info" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] max-w-[120px] truncate">
        {row.getValue("employmentInfo")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "references",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="References" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] max-w-[120px] truncate">
        {row.getValue("references")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
