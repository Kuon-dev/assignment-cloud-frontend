import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Shell } from "@/components/landing/shell";
import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";
import PropertyCard from "@/components/listing/listing-card";
import ListingForm from "@/components/listing/form/listing-form";
import PropertyForm from "@/components/property/form/property-form";

const properties = [
  {
    images: [
      "https://via.placeholder.com/800x500",
      "https://via.placeholder.com/800x500",
      "https://via.placeholder.com/800x500",
    ],
    title: "Modern Family Home",
    description: "A beautiful modern family home located in the suburbs.",
    price: "$350,000",
    location: "California, USA",
    bedrooms: 3,
    bathrooms: 2,
    rating: 4.5,
  },
  {
    images: [
      "https://via.placeholder.com/800x500",
      "https://via.placeholder.com/800x500",
      "https://via.placeholder.com/800x500",
    ],
    title: "Luxury Condo",
    description: "Experience luxury living in this downtown condo.",
    price: "$500,000",
    location: "New York, USA",
    bedrooms: 2,
    bathrooms: 1,
    rating: 4.7,
  },
  {
    images: [
      "https://via.placeholder.com/800x500",
      "https://via.placeholder.com/800x500",
      "https://via.placeholder.com/800x500",
    ],
    title: "Luxury Condo",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus quos doloremque, fugiat unde magnam impedit cum vero sapiente labore aspernatur.",
    price: "$500,000",
    location: "New York, USA",
    bedrooms: 2,
    bathrooms: 1,
    rating: 4.7,
  },
  {
    images: [
      "https://via.placeholder.com/800x500",
      "https://via.placeholder.com/800x500",
      "https://via.placeholder.com/800x500",
    ],
    title: "Luxury Condo",
    description:
      "Lorem ipsum elit. Possimus quos doloremque, fugiat unde magnam impedit cum vero sapiente labore aspernatur.",
    price: "$500,000",
    location: "New York, USA",
    bedrooms: 2,
    bathrooms: 1,
    rating: 4.7,
  },
  {
    images: [
      "https://via.placeholder.com/800x500",
      "https://via.placeholder.com/800x500",
      "https://via.placeholder.com/800x500",
    ],
    title: "Luxury Condo",
    description:
      "Lorem quos doloremque, fugiat unde magnam impedit cum vero sapiente labore aspernatur.",
    price: "$500,000",
    location: "New York, USA",
    bedrooms: 2,
    bathrooms: 1,
    rating: 4.7,
  },
];

export function Listing() {
  return (
    <>
      <Shell className="">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-white">
          Property Listings
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {properties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>
      </Shell>
    </>
  );
}

export default function ListingLayout() {
  return (
    <>
      <Navbar />
      <div className="w-full bg-black dark:bg-grid-white/[0.1] bg-grid-black/[0.2] pb-20 pt-32">
        <div className="mx-auto max-w-4xl">
          <Button variant="link">
            <Link to="/">&larr; Back to Home</Link>
          </Button>

          {/* <Listing /> */}
          <ListingForm />
          {/* <PropertyForm ownerId={"37c4f100-0016-4e91-bdf3-b975b4abec08"} /> */}

          <Footer className="pt-10 mx-auto" />
        </div>
      </div>
    </>
  );
}
