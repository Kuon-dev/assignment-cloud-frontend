import { ColumnDef } from "@tanstack/react-table";
import { FilterOption } from "../custom/admin-custom-table-toolbar";
import { AdminCustomTable } from "../custom/admin-custom-table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/custom/button";
import { Link, useNavigate } from "@remix-run/react";
import { useAdminStore } from "@/stores/admin-store";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: number;
  profilePictureUrl: string;
  passwordHash: string;
}

const columns = (
  handleDelete: (userId: string) => void,
  navigateToEdit: (user: User) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      const role = getValue();
      if (role === 1) return "Owner";
      if (role === 2) return "Admin";
      if (role === 0) return "Tenant";
      return "Unknown";
    },
  },
  {
    header: "Action",
    cell: ({ row }) => (
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
          <DropdownMenuContent align="end" className="w-[160px] font-semibold">
            <DropdownMenuItem
              onClick={() => {
                navigateToEdit(row.original);
              }}
            >
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    ),
  },
];

interface UserManagementProps {
  searchTerm: string;
  data: [];
  filters: FilterOption[];
  pageIndex: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalPages: number;
  setPageIndex: (pageIndex: number) => void;
  handleDelete: (userId: string) => void;
}

export default function UserManagementComponent({
  searchTerm,
  data,
  filters,
  pageIndex,
  pageSize,
  setPageSize,
  totalPages,
  setPageIndex,
  handleDelete,
}: UserManagementProps) {
  const navigate = useNavigate();

  const [editingData, setEditingData] = useAdminStore((state) => [
    state.editingData,
    state.setEditingData,
  ]);
  const navigateToEdit = (user: User) => {
    setEditingData(user);
    navigate(`/users/edit`);
  };

  return (
    <section className="w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Link to={`/users/new`}>Add User</Link>
        </Button>
      </div>
      <AdminCustomTable
        searchTerm={searchTerm}
        columns={columns(handleDelete, navigateToEdit)}
        data={data.users}
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
