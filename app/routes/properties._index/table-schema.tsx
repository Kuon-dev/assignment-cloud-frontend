import { useState } from "react";
import { toast } from "sonner";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { TableColumn } from "@/components/custom/data-table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import PropertyForm from "@/components/property/form/property-form";
import ListingForm from "@/components/listing/form/listing-form";

function getStatusTextAndClass(isAvailable: boolean) {
  return isAvailable
    ? { text: "Available", className: "text-green-500 font-semibold" }
    : { text: "Unavailable", className: "text-red-500 font-semibold" };
}

export const columns: TableColumn<Property>[] = [
  {
    header: "Image",
    accessor: (row) => (
      <img
        src={row.imageUrls[0]}
        alt={row.address}
        className="w-24 rounded-md"
      />
    ),
  },
  {
    header: "Address",
    accessor: (row) => row.address,
  },
  {
    header: "City",
    accessor: (row) => row.city,
  },
  {
    header: "Rent Amount",
    accessor: (row) => `$${row.rentAmount.toFixed(2)}`,
  },
  {
    header: "Status",
    accessor: (row) => {
      const { text, className } = getStatusTextAndClass(row.isAvailable);
      return <span className={className}>{text}</span>;
    },
  },
  {
    header: "Actions",
    accessor: (row) => <ActionsCell row={row} />,
  },
];

const ActionsCell: React.FC<{ row: Property }> = ({ row }) => {
  const [dialogContent, setDialogContent] = useState<
    "edit" | "delete" | "list" | null
  >(null);
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);

  const onSubmit = async (property: Property) => {
    const res = await fetch(
      `${window.ENV?.BACKEND_URL}/api/Property/${property.id}`,
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
      toast.success("Property deleted successfully!");
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
            <DropdownMenuItem onClick={() => setDialogContent("edit")}>
              Edit Property
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!row.isAvailable}
              onClick={() => setDialogContent("list")}
            >
              List Property
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => setDialogContent("delete")}
            >
              Delete Property
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          {dialogContent === "edit" && <PropertyForm property={row} />}
          {dialogContent === "list" && <ListingForm property={row} />}
          {dialogContent === "delete" && (
            <div className="rounded-md shadow-md">
              <p className="text-lg font-semibold mb-4">
                Are you sure you want to delete this property?
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
