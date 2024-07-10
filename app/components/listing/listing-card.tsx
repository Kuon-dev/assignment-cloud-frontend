import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { EyeIcon, BedIcon, BathIcon } from "lucide-react";
import { Link } from "@remix-run/react";

interface PropertyCardProps {
  listing: Listing;
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  const {
    id,
    title,
    description,
    price,
    location,
    bedrooms,
    bathrooms,
    imageUrls,
    views,
  } = listing;

  return (
    <Card className="w-full mx-auto p-4 sm:p-6 md:p-8 mb-6 flex flex-col justify-between">
      <div className="flex flex-col gap-6">
        <div>
          <Carousel className="rounded-lg overflow-hidden">
            <CarouselContent>
              {imageUrls.map((url, index) => (
                <CarouselItem key={index}>
                  <img
                    src={url}
                    alt={
                      title
                        ? `${title} image ${index + 1}`
                        : `Property Image ${index + 1}`
                    }
                    className="object-cover w-full h-48 md:h-64"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="mt-4 text-gray-400 text-sm">
            <p>{location}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-3">
            <EyeIcon className="w-6 h-6" />
            <span className="text-sm font-medium">{views}</span>
          </div>
          <div className="prose max-w-none text-white">
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <p
            className="text-gray-300 overflow-hidden text-ellipsis"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              minHeight: "4.5rem",
            }}
          >
            {description}
          </p>
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-bold text-white mb-2">$ {price}</div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
          <BedIcon className="w-5 h-5" />
          <span>{bedrooms} Bedrooms</span>
          <BathIcon className="w-5 h-5" />
          <span>{bathrooms} Bathrooms</span>
        </div>
        <Link to={`/Listing/${id}`} className="w-full">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
