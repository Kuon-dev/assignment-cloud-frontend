// components/PropertyCard.tsx
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { StarIcon, HeartIcon, BedIcon, BathIcon } from "lucide-react";

interface PropertyCardProps {
  images: string[];
  title: string;
  description: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  rating: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  images,
  title,
  description,
  price,
  location,
  bedrooms,
  bathrooms,
  rating,
}) => {
  return (
    <Card className="max-w-sm mx-auto p-4 sm:p-6 md:p-8 mb-6 flex flex-col justify-between">
      <div className="flex flex-col gap-6">
        <div>
          <Carousel className="rounded-lg overflow-hidden">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <img
                    src={img}
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
        <div className="flex flex-col gap-2">
          <div className="prose max-w-none text-white">
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <StarIcon className="w-5 h-5 fill-primary" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <Button variant="ghost" className="w-auto">
              <HeartIcon className="w-5 h-5" />
            </Button>
          </div>
          <p
            className="text-gray-300 overflow-hidden text-ellipsis"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              minHeight: "4.5rem", // Adjust this value based on the font size and line height
            }}
          >
            {description}
          </p>
        </div>
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-bold text-white">{price}</div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <BedIcon className="w-5 h-5" />
          <span>{bedrooms} Bedrooms</span>
          <BathIcon className="w-5 h-5" />
          <span>{bathrooms} Bathrooms</span>
        </div>
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          View Details
        </Button>
      </div>
    </Card>
  );
};
