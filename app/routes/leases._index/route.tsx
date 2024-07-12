import { DataTable } from "@/components/custom/data-table";
import { PaginationComponent } from "@/components/custom/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast } from "@/lib/handle-error";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { cookieConsent } from "@/utils/cookies.server";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { columns } from "./table-schema";
import { useState } from "react";
import { TableFilter } from "@/components/custom/data-table-filter";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pageNumber = url.searchParams.get("page") || "1";
  const pageSize = url.searchParams.get("size") || "10";

  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);
  const userSession = await cookieConsent.parse(cookieHeader);
  if (!userSession || !userSession.token) {
    // return redirect("/login");
  }

  const leaseData: LeaseLoaderData = {
    leases: [],
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/users/leases?page=${pageNumber}&size=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.ok) {
      const data = await res.json();
      leaseData.leases = data;
    } else if (res.status === 404) {
      leaseData.leases = [];
    } else {
      console.error(`Error ${res.status}: ${res.statusText}`);
    }
  } catch (error) {
    console.error(error);
    showErrorToast(error);
  }

  return json(leaseData);
};

export default function Leases() {
  const data = useLoaderData<typeof loader>();
  const { leases } = data;

  const [filteredLeases, setFilteredLeases] = useState(leases);
  const filterFunction = (lease: Lease, filter: string) => {
    switch (filter) {
      case "all":
        return true;
      case "active":
        return lease.isActive;
      case "inactive":
        return !lease.isActive;
      default:
        return false;
    }
  };

  return (
    <section className="w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Leases</h1>
      <TableFilter<Lease>
        data={leases}
        filterFunction={filterFunction}
        onFilter={setFilteredLeases}
        filterOptions={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => (
            <>
              <DataTable columns={columns} data={filteredLeases} />

              <div className="mt-4 flex justify-between">
                {/* <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handleNavigation}
                /> */}
              </div>
            </>
          )}
        </ClientOnly>
      </div>
    </section>
  );
}

function LoadingComponent() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we are preparing the content
        </p>
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

const LeaseFilter = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="status-filter" className="mr-2">
        Filter Status:
      </label>
      <select
        id="status-filter"
        value={filter}
        onChange={handleFilterChange}
        className="p-2 border rounded bg-transparent"
      >
        <option value="all" className="bg-black">
          All
        </option>
        <option value="active" className="bg-black">
          Active
        </option>
        <option value="inactive" className="bg-black">
          Inactive
        </option>
      </select>
    </div>
  );
};
