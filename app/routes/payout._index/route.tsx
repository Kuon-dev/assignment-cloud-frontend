import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import * as React from "react";
import { FilterOption } from "@/components/custom/admin-custom-table-toolbar";
import PayoutPeriodsComponent from "@/components/payout/payout-periods";
import { ClientOnly } from "remix-utils/client-only";

export const loader: LoaderFunction = async ({ request }) => {
  // const url = new URL(request.url);
  // const pageNumber = url.searchParams.get("page") || "1";
  // const pageSize = url.searchParams.get("size") || "10";

  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);

  const payoutPeriodData = {
    periods: [],
    // totalPages: 0,
    // currentPage: parseInt(pageNumber),
    authToken: authToken,
  };

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/Payout/periods`,
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
      payoutPeriodData.periods = data;
      // payoutPeriodData.currentPage = data.pageNumber;
      // payoutPeriodData.totalPages = Math.ceil(data.totalCount / data.pageSize);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json(payoutPeriodData);
};

export default function PayoutPeriods() {
  const data = useLoaderData<typeof loader>();
  const { periods, currentPage, totalPages, authToken } = data;
  // const [searchParams, setSearchParams] = useSearchParams();
  // const pageIndex = parseInt(searchParams.get("page") || "1", 10) - 1;
  // const pageSize = parseInt(searchParams.get("size") || "10", 10);
  const [filters, setFilters] = React.useState<FilterOption[]>([]);

  const handlePageChange = (newPageIndex: number) => {
    //   setSearchParams({
    //     page: (newPageIndex + 1).toString(),
    //     size: pageSize.toString(),
    //   });
  };

  const handleSizeChange = (newPageSize: number) => {
    // setSearchParams({ size: newPageSize.toString(), page: "1" });
  };

  // React.useEffect(() => {
  //   setSearchParams({
  //     page: (pageIndex + 1).toString(),
  //     size: pageSize.toString(),
  //   });
  // }, [searchParams]);

  return (
    <ClientOnly>
      {() => (
        <section className="w-full mx-auto">
          <PayoutPeriodsComponent
            data={periods}
            filters={filters}
            pageIndex={1}
            pageSize={10}
            setPageSize={handleSizeChange}
            totalPages={1}
            setPageIndex={handlePageChange}
          />
        </section>
      )}
    </ClientOnly>
  );
}
