import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";

import PropertyCarousel from "@/components/property/property-carousel";
import { BedIcon, BathIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Shell } from "@/components/landing/shell";
import { ClientOnly } from "remix-utils/client-only";
import { getAuthTokenFromCookie } from "@/lib/router-guard";

export const loader: LoaderFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie");
  const authToken = getAuthTokenFromCookie(cookieHeader);
  const userSession = await cookieConsent.parse(cookieHeader);
  if (!userSession || !userSession.token) {
    // return redirect("/login");
  }

  const listingDetailData: ListingDetailLoaderData = {
    listing: {
      id: "",
      title: "",
      description: "",
      price: 0,
      startDate: "",
      endDate: "",
      isActive: false,
      views: 0,
      imageUrls: [],
      location: "",
      bedrooms: 0,
      bathrooms: 0,
      amenities: [],
    },
    ENV: {
      BACKEND_URL: process.env.BACKEND_URL || "",
    },
  };
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/Listings/${params.listingId}`,
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

      listingDetailData.listing = data;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data");
  }

  return json({
    ...listingDetailData,
  });
};

export default function ListingDetail() {
  const data = useLoaderData<ListingDetailLoaderData>();
  const { listing } = data;

  return (
    <Shell>
      <PropertyCarousel />
      <div className="flex flex-col gap-2 p-2 bg">
        <h1 className="text-3xl font-semibold text-gray-600 mb-4">
          Rent ${listing.price.toFixed(2)}
        </h1>
        <h2 className="text-2xl font-bold mb-2">{listing.title}</h2>
        <p className="text-md mb-2 font-semibold">{listing.location}</p>
        <p className="text-lg mb-4">{listing.description}</p>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <BedIcon className="text-xl mr-1" />
            <span>{listing.bedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center">
            <BathIcon className="text-xl mr-1" />
            <span>{listing.bathrooms} Bathrooms</span>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Amenities</h3>

          <div className="flex gap-2">
            {listing.amenities.map((amenity, index) => (
              <Badge key={index} className="text-md font-semibold">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
