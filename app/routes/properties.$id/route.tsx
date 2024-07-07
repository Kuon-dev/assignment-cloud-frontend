import { useEffect, useState } from "react";
import Footer from "@/components/landing/footer";
import NavBar from "@/components/landing/navbar";
import { Shell } from "@/components/landing/shell";
import PropertyCardTags from "@/components/property/property-card";
import { useParams } from "@remix-run/react";
import PropertyCarousel from "@/components/property/property-carousel";
import PropertyListingTab from "@/components/property/property-tabs";
import PropertyFaqSection from "@/components/property/property-faq";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [desc, setDesc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // useEffect(() => {
  //   const fetchPropertyData = async () => {
  //     try {
  //       const response = await fetch(
  //         `${window.ENV?.BACKEND_URL}/api/Property/${id}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //           },
  //           credentials: "include",
  //         }
  //       );

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(errorData.message || "Failed to fetch property data");
  //       }

  //       const data = await response.json();
  //       const property = data;
  //       const extractedAmenities = property.amenities || [];
  //       const desc = property.description || "";
  //       setDesc(desc);
  //       setAmenities(extractedAmenities);
  //       setIsLoading(false);
  //     } catch (err) {
  //       setError(err as Error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchPropertyData();
  // }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <Shell>
      <NavBar />
      <div className="mt-20 flex justify-center">
        <PropertyCarousel />
      </div>
      <div className="flex items-center justify-between mt-20 mb-10">
        <PropertyCardTags
          amenities={amenities}
          className="max-w-80 mr-10 border border-grey rounded-lg shadow-xl"
        />
        <PropertyListingTab desc={desc} className="max-w-160" />
      </div>
      <PropertyFaqSection />
      <Footer />
    </Shell>
  );
}
