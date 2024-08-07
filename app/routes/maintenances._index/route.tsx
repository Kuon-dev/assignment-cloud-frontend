import { json, LoaderFunction } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";
import { ClientOnly } from "remix-utils/client-only";
import { useLoaderData } from "@remix-run/react";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast } from "@/lib/handle-error";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { DataTable } from "@/components/custom/data-table";
import { columns } from "./table-schema";
import { useState } from "react";
import { TableFilter } from "@/components/custom/data-table-filter";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);

  const maintenanceData: MaintenanceLoaderData = {
    maintenances: [],
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/users/maintenance-requests`,
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
      maintenanceData.maintenances = data;
    }
  } catch (error) {
    showErrorToast(error);
  }

  return json(maintenanceData);
};

export default function Maintenances() {
  const data = useLoaderData<typeof loader>();
  const { maintenances } = data;

  const [filteredMaintenances, setFilteredMaintenances] =
    useState(maintenances);
  const filterFunction = (
    maintenance: Maintenance,
    filter: string,
  ): boolean => {
    switch (filter) {
      case "all":
        return true;
      case "pending":
        return parseInt(maintenance.maintenanceRequest.status) === 0;
      case "inProgress":
        return parseInt(maintenance.maintenanceRequest.status) === 1;
      case "completed":
        return parseInt(maintenance.maintenanceRequest.status) === 2;
      case "cancelled":
        return parseInt(maintenance.maintenanceRequest.status) === 3;
      default:
        return false;
    }
  };

  return (
    <section className="w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Maintenance Requests</h1>
      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => (
            <>
              <TableFilter<Maintenance>
                data={maintenances}
                filterFunction={filterFunction}
                onFilter={setFilteredMaintenances}
                filterOptions={[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "inProgress", label: "In Progress" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
              <DataTable columns={columns} data={filteredMaintenances} />
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
