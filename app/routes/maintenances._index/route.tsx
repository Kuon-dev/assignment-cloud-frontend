import { json, LoaderFunction } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";
import { ClientOnly } from "remix-utils/client-only";
import { useLoaderData } from "@remix-run/react";
import { Skeleton } from "@/components/ui/skeleton";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pageNumber = url.searchParams.get("pageNumber") || "1";
  const pageSize = url.searchParams.get("pageSize") || "10";

  const cookieHeader = request.headers.get("Cookie");
  const userSession = await cookieConsent.parse(cookieHeader);
  if (!userSession || !userSession.token) {
    // return redirect("/login");
  }

  const maintenanceData: MaintenanceLoaderData = {
    maintenances: [],
    totalPages: 0,
    currentPage: parseInt(pageNumber),
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/Maintenance/request?page=${pageNumber}&size=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZlMTczNDQxLTdjM2QtNGNjMS1iNDVkLTMyZTBjNmM3MjhjYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InRlc3QzQG1haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiT3duZXIiLCJqdGkiOiJlZGY4Njc5ZS05NGFmLTQzZGYtYjYwZC0xYTQxMGUxZDFjNjAiLCJleHAiOjE3MjA1MDg3NTYsImlzcyI6Imt1b24iLCJhdWQiOiJrdW9uIn0.RcoYDh4SDHcFSCMWqRPRy6wpMPwmItxQZG2NcaCgHEM`,
        },
      },
    );

    if (res.ok) {
      const data = await res.json();

      maintenanceData.maintenances = data.items;
      maintenanceData.currentPage = data.currentPage;
      maintenanceData.totalPages = Math.ceil(data.totalCount / data.pageSize);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json(maintenanceData);
};

export default function Maintenances() {
  const data = useLoaderData<typeof loader>();
  console.log(data);

  return (
    <section className="w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Maintenance Requests</h1>
      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => <>aba</>}
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
