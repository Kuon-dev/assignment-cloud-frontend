import { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";

import PropertyCard from "@/components/listing/listing-card";
import { Shell } from "@/components/landing/shell";
import { ClientOnly } from "remix-utils/client-only";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { useDashboardStore } from "@/stores/dashboard-store";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/custom/data-table";
import { columns } from "./table-schema";
import { TableFilter } from "@/components/custom/data-table-filter";
import { showErrorToast } from "@/lib/handle-error";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);
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

  const url = authToken
    ? `${process.env.BACKEND_URL}/api/users/listings`
    : `${process.env.BACKEND_URL}/api/Listings`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      listingData.listings = data;
    }
  } catch (error) {
    showErrorToast(error);
  }

  return json({
    ...listingData,
  });
};

export default function Listings() {
  const user = useDashboardStore((state) => state.user);
  const initialData = useLoaderData<ListingsLoaderData>();
  const [listings, setListings] = useState<Listing[]>(initialData.listings);

  const fetchListings = useCallback(async () => {
    const cookieHeader = document.cookie;
    const authToken = getAuthTokenFromCookie(cookieHeader);

    const url = authToken
      ? `${initialData.ENV.BACKEND_URL}/api/users/listings`
      : `${initialData.ENV.BACKEND_URL}/api/Listings`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (error) {
      showErrorToast(error);
    }
  }, [initialData.ENV.BACKEND_URL]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <>
      <section className="w-full mx-auto">
        {user?.owner ? (
          <OwnerComponent listings={listings} fetchListings={fetchListings} />
        ) : (
          <GuestComponent listings={listings} />
        )}
      </section>
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

type GuestComponentProps = {
  listings: { items: Listing[] };
};

function GuestComponent({ listings }: GuestComponentProps) {
  return (
    <>
      <Shell>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-white">
          Listings
        </h1>
        <ClientOnly>
          {() => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {listings.items.map((listing, index) => (
                <PropertyCard key={index} listing={listing} />
              ))}
            </div>
          )}
        </ClientOnly>
      </Shell>
    </>
  );
}

type OwnerComponentProps = {
  listings: Listing[];
  fetchListings: () => void;
};

function OwnerComponent({ listings, fetchListings }: OwnerComponentProps) {
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const filterFunction = (listing: Listing, filter: string): boolean => {
    switch (filter) {
      case "all":
        return true;
      case "active":
        return listing.isActive;
      case "inactive":
        return !listing.isActive;
      default:
        return false;
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Listing</h1>
      <div>
        <ClientOnly fallback={<LoadingComponent />}>
          {() => (
            <>
              <TableFilter<Listing>
                data={listings}
                filterFunction={filterFunction}
                onFilter={setFilteredListings}
                filterOptions={[
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
              />
              <DataTable
                columns={columns(fetchListings)}
                data={filteredListings}
              />

              <div className="mt-4 flex justify-between"></div>
            </>
          )}
        </ClientOnly>
      </div>
    </>
  );
}
