import { ColumnDef } from "@tanstack/react-table";
import { FilterOption } from "@/components/custom/admin-custom-table-toolbar";
import { AdminCustomTable } from "@/components/custom/admin-custom-table";
import { useNavigate, Link } from "@remix-run/react";
import { useAdminStore } from "@/stores/admin-store";
import { Button } from "@/components/custom/button";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  profilePictureUrl: string;
  passwordHash: string;
  owner: { id: string };
  admin: { id: string };
  tenant: { id: string };
}

const columns = (): ColumnDef<User>[] => [
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
];

interface OwnersProps {
  searchTerm: string;
  data: User[];
  filters: FilterOption[];
  pageIndex: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalPages: number;
  setPageIndex: (pageIndex: number) => void;
}

export default function OwnersComponent({
  searchTerm,
  data,
  filters,
  pageIndex,
  pageSize,
  setPageSize,
  totalPages,
  setPageIndex,
}: OwnersProps) {
  const navigate = useNavigate();
  const [userData, setUserData] = useAdminStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const navigateToFinancialReconciliation = (owner: User) => {
    const payoutPeriodId = userData.payoutPeriodId;
    setUserData({ payoutPeriodId: payoutPeriodId, ownerId: owner.owner.id });
    navigate(`/payout/financial-reconciliation`);
  };

  return (
    <section className="w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Owners</h1>
      </div>
      <AdminCustomTable
        searchTerm={searchTerm}
        columns={columns()}
        data={data}
        filters={filters}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        setPageIndex={setPageIndex}
        onRowClick={navigateToFinancialReconciliation}
      />
    </section>
  );
}
