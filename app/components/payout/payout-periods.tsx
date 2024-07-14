import { ColumnDef } from "@tanstack/react-table";
import { FilterOption } from "@/components/custom/admin-custom-table-toolbar";
import { AdminCustomTable } from "@/components/custom/admin-custom-table";
import { useNavigate, Link } from "@remix-run/react";
import { useAdminStore } from "@/stores/admin-store";
import { Button } from "@/components/custom/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

interface payoutPeriods {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-GB").format(new Date(date));
};

const columns = (
  navigateToOwnerList: (payoutPeriodData: payoutPeriods) => void,
): ColumnDef<payoutPeriods>[] => [
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.original.startDate),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => formatDate(row.original.endDate),
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    header: "Actions",
    cell: ({ row }) => (
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
          <DropdownMenuItem onClick={() => navigateToOwnerList(row.original)}>
            Choose Owner
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface PeriodsProps {
  searchTerm: string;
  data: payoutPeriods[];
  filters: FilterOption[];
  pageIndex: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  totalPages: number;
  setPageIndex: (pageIndex: number) => void;
}

export default function PayoutPeriodsComponent({
  searchTerm,
  data,
  filters,
  pageIndex,
  pageSize,
  setPageSize,
  totalPages,
  setPageIndex,
}: PeriodsProps) {
  const navigate = useNavigate();
  const [payoutData, setPayoutData] = useAdminStore((state) => [
    state.payoutData,
    state.setPayoutData,
  ]);

  const navigateToOwnerList = (payoutPeriodData: payoutPeriods) => {
    const id = payoutPeriodData.id;
    setPayoutData({ payoutPeriodId: id });
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
        searchTerm={searchTerm}
        columns={columns(navigateToOwnerList)}
        data={data.items}
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
