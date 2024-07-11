import { json, LoaderFunction } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { useLoaderData } from "@remix-run/react";
import { useDashboardStore } from "@/stores/dashboard-store";

import { ClientOnly } from "remix-utils/client-only";
import { showErrorToast } from "@/lib/handle-error";
import { DataTable } from "@/components/custom/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./table-schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PropertyForm from "@/components/property/form/property-form";
import { Plus } from "lucide-react";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);
  const userSession = await cookieConsent.parse(cookieHeader);
  if (!userSession || !userSession.token) {
    // return redirect("/login");
  }

  const propertyData: PropertyLoaderData = {
    properties: [],
  };

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/users/owned-property`,
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
      propertyData.properties = data;
    }
  } catch (error) {
    console.error(error);
    showErrorToast(error);
  }
  return json({
    ...propertyData,
  });
};

export default function Properties() {
  const user = useDashboardStore((state) => state.user);
  const data = useLoaderData<typeof loader>();
  const { properties } = data;

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Properties</h1>

      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => (
            <>
              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link">
                      <span>
                        <Plus className="w-5 h-5 mr-2" />
                      </span>
                      Add Property
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <PropertyForm ownerId={user.owner.id} />
                  </DialogContent>
                </Dialog>
              </div>

              <DataTable columns={columns} data={properties} />
            </>
          )}
        </ClientOnly>
      </div>
    </>
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
