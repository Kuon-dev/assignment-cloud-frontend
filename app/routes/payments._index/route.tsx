import { DataTable } from "@/components/custom/data-table";
import { PaginationComponent } from "@/components/custom/data-table-pagination";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { cookieConsent } from "@/utils/cookies.server";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./table-schema";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pageNumber = url.searchParams.get("pageNumber") || "1";
  const pageSize = url.searchParams.get("pageSize") || "10";

  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);
  const userSession = await cookieConsent.parse(cookieHeader);
  if (!userSession || !userSession.token) {
    // return redirect("/login");
  }

  const paymentData: PaymentLoaderData = {
    payments: [],
    totalCount: 0,
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/Payments?page=${pageNumber}&size=${pageSize}`,
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
      console.log(data);

      paymentData.payments = data.payments;
      paymentData.totalCount = data.totalCount;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json(paymentData);
};

export default function Payments() {
  const data = useLoaderData<typeof loader>();
  const { payments, currentPage, totalPages } = data;
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNavigation = (page: number) => {
    setSearchParams({ pageNumber: page.toString() });
  };
  console.log(payments);

  return (
    <section className="w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Payment History</h1>
      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => (
            <>
              <DataTable columns={columns} data={payments} />
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handleNavigation}
              />
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
