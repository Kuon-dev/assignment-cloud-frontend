import { ColumnDef } from "@tanstack/react-table";
import { FilterOption } from "@/components/custom/admin-custom-table-toolbar";
import { AdminCustomTable } from "@/components/custom/admin-custom-table";
import { useNavigate, Link } from "@remix-run/react";
import { useAdminStore } from "@/stores/admin-store";
import { Button } from "@/components/custom/button";

interface payoutPeriods {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

const columns = (): ColumnDef<payoutPeriods>[] => [
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

interface PeriodsProps {
  data: payoutPeriods[];
  filters: FilterOption[];
  pageIndex: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalPages: number;
  setPageIndex: (pageIndex: number) => void;
}

export default function PayoutPeriodsComponent({
  data,
  filters,
  pageIndex,
  pageSize,
  setPageSize,
  totalPages,
  setPageIndex,
}: PeriodsProps) {
  const navigate = useNavigate();
  const [userData, setUserData] = useAdminStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const navigateToOwnerList = (payoutPeriodData: payoutPeriods) => {
    const id = payoutPeriodData.id;
    setUserData({ payoutPeriodId: id });
    navigate(`/payout/owner-list`);
  };

  return (
    <section className="w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Payout Periods</h1>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Link to={`/payout/new`}>Create New Period</Link>
        </Button>
      </div>
      <AdminCustomTable
        searchTerm=""
        columns={columns()}
        data={data}
        filters={filters}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
        setPageIndex={setPageIndex}
        onRowClick={navigateToOwnerList}
      />
    </section>
  );
}
