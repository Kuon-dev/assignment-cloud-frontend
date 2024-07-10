import { json, LoaderFunction } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";

import { useDashboardStore } from "@/stores/dashboard-store";
import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "@/components/listing/listing-card";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const userSession = await cookieConsent.parse(cookieHeader);
  if (!userSession || !userSession.token) {
    // return redirect("/login");
  }

  const listingData: ListingsLoaderData = {
    listings: [],
    ENV: {
      BACKEND_URL: process.env.BACKEND_URL || "",
    },
  };
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/Listings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${userSession.token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      listingData.listings = data.items;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json({
    ...listingData,
  });
};

export default function Component() {
  const user = useDashboardStore((state) => state.user);

  return (
    <section className="w-full mx-auto">
      {user?.tenant && <TenantComponent />}
      {user?.owner && <OwnerComponent />}
      {user?.admin && <AdminComponent />}
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

function TenantComponent() {
  const data = useLoaderData<ListingsLoaderData>();
  const { listings } = data;

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Listing Properties</h1>

      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <PropertyCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          )}
        </ClientOnly>
      </div>
    </>
  );
}

function OwnerComponent() {
  return <h1 className="text-2xl font-semibold mb-4">Owner Dashboard</h1>;
}

function AdminComponent() {
  return <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>;
}
