// routes/index.tsx
import { useState } from "react";
import PropertyCard from "@/components/listing/listing-card";
import {
  ListingFilterForm,
  ListingFilterFormValues,
} from "@/components/listing/form/listing-filter-form";
import RentalApplicationForm from "@/components/rental/form/rental-application-form";
import MaintenanceRequestForm from "@/components/maintenance/form/maintenance-request-form";

export default function Component() {
  const [filters, setFilters] = useState<ListingFilterFormValues>({
    location: "",
    minPrice: 0,
    maxPrice: 5000,
    bedrooms: 1,
    amenities: [],
  });

  const properties = [
    {
      images: ["property1.jpg"],
      title: "Beautiful Apartment",
      description: "A beautiful apartment in the heart of the city.",
      price: "$1,500/month",
      location: "123 Main St, City, State",
      bedrooms: 2,
      bathrooms: 1,
      rating: 4.5,
    },
    {
      images: ["property2.jpg"],
      title: "Cozy House",
      description:
        "A cozy house with a big backyard. with a big backyard.with a big backyard.",
      price: "$2,000/month",
      location: "456 Oak St, City, State",
      bedrooms: 3,
      bathrooms: 2,
      rating: 4.7,
    },
    {
      images: ["property2.jpg"],
      title: "Cozy House",
      description: "A cozy house with a big backyard. with a big backyard.",
      price: "$2,000/month",
      location: "456 Oak St, City, State",
      bedrooms: 3,
      bathrooms: 2,
      rating: 4.7,
    },
    {
      images: ["property2.jpg"],
      title: "Cozy House",
      description:
        "A cozy house with a big backyard. with a big backyard.with a big backyard.with a big backyard.with a big backyard.with a big backyard.",
      price: "$2,000/month",
      location: "456 Oak St, City, State",
      bedrooms: 3,
      bathrooms: 2,
      rating: 4.7,
    },
    {
      images: ["property2.jpg"],
      title: "Cozy House",
      description: "A cozy house with a big backyard.",
      price: "$2,000/month",
      location: "456 Oak St, City, State",
      bedrooms: 3,
      bathrooms: 2,
      rating: 4.7,
    },
  ];

  const handleFilterSubmit = (data: ListingFilterFormValues) => {
    setFilters(data);
    // Here you can also make an API call to fetch filtered properties
  };

  return (
    <section className="w-full mx-auto py-12">
      {/* <MaintenanceRequestForm propertyId="" /> */}
      {/* <RentalApplicationForm
        className="max-w-3xl mx-auto"
        tenantId="9f8d0949-eda0-472c-ab88-a384c88ef237"
        listingId="b193aa6b-4310-44c7-a995-8cff7b2b3ae0"
      /> */}
      {/* <RentalApplicationForm className="max-w-3xl mx-auto" /> */}
      {/* <ListingFilterForm onSubmit={handleFilterSubmit} />
      <Listing properties={properties} /> */}
    </section>
  );
}

export function Listing({ properties }: { properties: any[] }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Available Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {properties.map((property, index) => (
          <PropertyCard key={index} {...property} />
        ))}
      </div>
    </>
  );
}
