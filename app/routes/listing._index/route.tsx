import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";
import { toast } from "sonner";

import PropertyCard from "@/components/listing/listing-card";
import { Shell } from "@/components/landing/shell";
import { ClientOnly } from "remix-utils/client-only";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const userSession = await cookieConsent.parse(cookieHeader);
  if (!userSession || !userSession.token) {
    toast.error("You need to be logged in to view this page");
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
      listingData.listings = data.items.$values;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json({
    ...listingData,
  });
};

export default function Listings() {
  const data = useLoaderData<ListingsLoaderData>();
  const { listings } = data;

  return (
    <>
      <Shell>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-white">
          Listings
        </h1>
        <ClientOnly>
          {() => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {listings.map((listing, index) => (
                <PropertyCard key={index} listing={listing} />
              ))}
            </div>
          )}
        </ClientOnly>
      </Shell>
    </>
  );
}
