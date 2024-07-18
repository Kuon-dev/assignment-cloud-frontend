import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import * as React from "react";
import { FilterOption } from "@/components/custom/admin-custom-table-toolbar";
import { ClientOnly } from "remix-utils/client-only";
import AdminMaintenanceComponent from "@/components/maintenance/admin-requests";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/handle-error";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pageNumber = url.searchParams.get("page") || "1";
  const pageSize = url.searchParams.get("size") || "10";

  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);

  const maintenanceData = {
    maintenances: [],
    totalPages: 0,
    currentPage: parseInt(pageNumber),
    authToken: authToken,
  };

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/Admin/maintenance-requests?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      maintenanceData.maintenances = data.items;
      maintenanceData.currentPage = data.pageNumber;
      maintenanceData.totalPages = Math.ceil(data.totalCount / data.pageSize);
    }
  } catch (error) {
    showErrorToast(error);
  }

  return json(maintenanceData);
};

export default function Miantenance() {
  const data = useLoaderData<typeof loader>();
  const { maintenances, currentPage, totalPages, authToken } = data;
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = parseInt(searchParams.get("page") || "1", 10) - 1;
  const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const [filters, setFilters] = React.useState<FilterOption[]>([]);

  const handlePageChange = (newPageIndex: number) => {
    setSearchParams({
      page: (newPageIndex + 1).toString(),
      size: pageSize.toString(),
    });
  };

  const handleSizeChange = (newPageSize: number) => {
    setSearchParams({ size: newPageSize.toString(), page: "1" });
  };

  const handleDelete = async (maintenanceId: string) => {
    try {
      const response = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Admin/maintenance-requests/${maintenanceId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.authToken}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to delete maintenance");
      }
      toast.success("Maintenance request and task is deleted successfully.");

      setSearchParams(searchParams);
    } catch (error) {
      showErrorToast(error);
    }
  };

  React.useEffect(() => {
    setSearchParams({
      page: (pageIndex + 1).toString(),
      size: pageSize.toString(),
    });
  }, [searchParams]);

  return (
    <ClientOnly>
      {() => (
        <section className="w-full mx-auto">
          <AdminMaintenanceComponent
            searchTerm="address"
            data={maintenances}
            filters={filters}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageSize={handleSizeChange}
            totalPages={totalPages}
            setPageIndex={handlePageChange}
            handleDelete={handleDelete}
          />
        </section>
      )}
    </ClientOnly>
  );
}
