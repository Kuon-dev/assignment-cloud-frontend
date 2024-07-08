import { json, LoaderFunction } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { DataTable } from "@/components/custom/data-table";
import { columns } from "./table-schema";
import { PaginationComponent } from "@/components/custom/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthTokenFromCookie } from "@/lib/router-guard";

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
  console.log(request.headers);

  const applicationData: ApplicationLoaderData = {
    applications: [],
    totalPages: 0,
    currentPage: parseInt(pageNumber),
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/Applications?PageNumber=${pageNumber}&PageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    console.log(res);

    if (res.ok) {
      const data = await res.json();
      applicationData.applications = data.items;
      applicationData.currentPage = data.pageNumber;
      applicationData.totalPages = Math.ceil(data.totalCount / data.pageSize);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json(applicationData);
};

export default function Applications() {
  const data = useLoaderData<typeof loader>();
  const { applications, currentPage, totalPages } = data;
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get("pageNumber") || "1");

  const handleNavigation = (newPage: number) => {
    setSearchParams({ pageNumber: newPage.toString() });
  };

  return (
    <section className="w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Applications</h1>
      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => (
            <>
              <DataTable columns={columns} data={applications} />

              <div className="mt-4 flex justify-between">
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handleNavigation}
                />
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
