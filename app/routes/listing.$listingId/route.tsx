import { Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { cookieConsent } from "@/utils/cookies.server";
import { Shell } from "@/components/landing/shell";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { useDashboardStore } from "@/stores/dashboard-store";

import PropertyCarousel from "@/components/property/property-carousel";
import { BedIcon, BathIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RentalApplicationForm from "@/components/rental/form/rental-application-form";
import { showErrorToast } from "@/lib/handle-error";

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
      listingDetailData.listing = data;
    }
  } catch (error) {
    if (error instanceof Error) {
      showErrorToast(error.message);
    }
  }

  return json({
    ...listingDetailData,
  });
};

export default function ListingDetail() {
  const user = useDashboardStore((state) => state.user);
  const data = useLoaderData<ListingDetailLoaderData>();
  const { listing } = data;

  return (
    <>
      <Link to="/dashboard">
        <Button variant="link">&larr; Back</Button>
      </Link>
      <Shell>
        <PropertyCarousel slides={listing.imageUrls} />
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

            {listing.amenities.length > 0 ? (
              <div className="flex gap-2">
                {listing.amenities.map((amenity, index) => (
                  <Badge key={index} className="text-md font-semibold">
                    {amenity}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-md">No amenities available.</p>
            )}
          </div>

          {user?.tenant && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="inline-flex items-center font-semibold">
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply to rent this property</DialogTitle>
                  <DialogDescription>
                    Please fill out the form below to apply to rent this
                    property.
                  </DialogDescription>
                </DialogHeader>

                <RentalApplicationForm
                  tenantId={user?.tenant.id}
                  listingId={listing.id}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </Shell>
    </>
  );
}
