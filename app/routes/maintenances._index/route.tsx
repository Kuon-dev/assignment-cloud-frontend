import { json, LoaderFunction } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";
import { ClientOnly } from "remix-utils/client-only";
import { useLoaderData } from "@remix-run/react";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast } from "@/lib/handle-error";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { DataTable } from "@/components/custom/data-table";
import { columns } from "./table-schema";

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
    console.error(error);
    showErrorToast(error);
  }

  return json(maintenanceData);
};

export default function Maintenances() {
  const data = useLoaderData<typeof loader>();
  const { maintenances } = data;

  return (
    <section className="w-full mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Maintenance Requests</h1>
      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => (
            <>
              <DataTable columns={columns} data={maintenances} />
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
