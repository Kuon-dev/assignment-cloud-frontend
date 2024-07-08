import { useState } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";

import PropertyCard from "@/components/listing/listing-card";
import ListingFilterForm, {
  ListingFilterFormValues,
} from "@/components/listing/form/listing-filter-form";

export default function Component() {
  const [filters, setFilters] = useState<ListingFilterFormValues>({
    location: "",
    minPrice: 0,
    maxPrice: 5000,
    bedrooms: 1,
    amenities: [],
  });

  const handleFilterSubmit = (data: ListingFilterFormValues) => {
    setFilters(data);
    // Here you can also make an API call to fetch filtered properties
  };

  return <section className="w-full mx-auto py-12"></section>;
}

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
