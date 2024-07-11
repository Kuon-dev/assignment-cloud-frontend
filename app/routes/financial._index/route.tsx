import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import * as React from "react";
import { FilterOption } from "@/components/users/users-data-table-toolbar";
import OwnersComponent from "@/components/users/owner-list";
import { ClientOnly } from "remix-utils/client-only";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pageNumber = url.searchParams.get("page") || "1";
  const pageSize = url.searchParams.get("size") || "10";

  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);

  const usersData = {
    users: [],
    totalPages: 0,
    currentPage: parseInt(pageNumber),
    authToken: authToken,
  };

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/Admin/owners?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
      usersData.users = data.items;
      usersData.currentPage = data.pageNumber;
      usersData.totalPages = Math.ceil(data.totalCount / data.pageSize);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json(usersData);
};

export default function Users() {
  const data = useLoaderData<typeof loader>();
  const { users, currentPage, totalPages, authToken } = data;
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
          <OwnersComponent
            searchTerm="email"
            data={data}
            filters={filters}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageSize={handleSizeChange}
            totalPages={totalPages}
            setPageIndex={handlePageChange}
          />
        </section>
      )}
    </ClientOnly>
  );
}
