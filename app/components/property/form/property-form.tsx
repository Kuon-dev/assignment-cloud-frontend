import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ClientOnly } from "remix-utils/client-only";

import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/custom/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import ImageUpload, { ImageFile } from "@/components/custom/image-upload";

interface PropertyFormProps {
  ownerId?: string;
  property?: Property;
}

type PropertyFormErrorSchema = {
  data: {
    message: string;
    details?: string;
    timestamp?: string;
  };
  statusCode: number;
  error: string;
  stackTrace?: string;
};

const propertyTypes = ["Apartment", "House", "Condo", "Townhouse"] as const;
const roomTypes = ["MasterBedroom", "MiddleBedroom", "SmallBedroom"] as const;

enum PropertyType {
  Apartment,
  House,
  Condo,
  Townhouse,
}

enum RoomType {
  MasterBedroom,
  MiddleBedroom,
  SmallBedroom,
}

const PropertyFormSchema = z.object({
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "Zip Code is required" }),
  propertyType: z.nativeEnum(PropertyType, {
    required_error: "Property type is required",
  }),
  bedrooms: z.number().min(1, { message: "At least one bedroom is required" }),
  bathrooms: z
    .number()
    .min(1, { message: "At least one bathroom is required" }),
  rentAmount: z.number().min(1, { message: "Rent amount is required" }),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  isAvailable: z.boolean(),
  roomType: z.nativeEnum(RoomType, { required_error: "Room type is required" }),
});

export default function PropertyForm({ ownerId, property }: PropertyFormProps) {
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const [isLoading, setIsLoading] = useState(false);

  const [images, setImages] = useState<ImageFile[]>(
    property?.imageUrls?.map((url) => ({ preview: url }) as ImageFile) || [],
  );

  const form = useForm<z.infer<typeof PropertyFormSchema>>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      address: property?.address || "",
      city: property?.city || "",
      state: property?.state || "",
      zipCode: property?.zipCode || "",
      propertyType: property?.propertyType || PropertyType.Apartment,
      roomType: property?.roomType || RoomType.MasterBedroom,
      bedrooms: property?.bedrooms || 1,
      bathrooms: property?.bathrooms || 1,
      rentAmount: property?.rentAmount || 0,
      description: property?.description || "",
      amenities: property?.amenities || [],
      isAvailable: property?.isAvailable || false,
    },
  });

  async function blobUrlToFile(
    blobUrl: string,
    fileName: string,
  ): Promise<File> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }

  async function onSubmit(data: z.infer<typeof PropertyFormSchema>) {
    try {
      setIsLoading(true);

      const formData = new FormData();
      for (const image of images) {
        if (image.preview.startsWith("blob:")) {
          const file = await blobUrlToFile(image.preview, image.name);
          formData.append("images", file);
        } else {
          formData.append("images", image);
        }
      }

      const imageUpload = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Property/upload-images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        },
      );

      if (!imageUpload.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadedImageUrls: string[] = [];
      const imageUploadData = await imageUpload.json();
      uploadedImageUrls.push(imageUploadData.url);

      const url = property
        ? `${window.ENV?.BACKEND_URL}/api/Property/${property.id}`
        : `${window.ENV?.BACKEND_URL}/api/Property`;
      const res = await fetch(url, {
        method: property ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...data,
          imageUrls: uploadedImageUrls,
          ownerId,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = (await res.json()) as PropertyFormErrorSchema;
        throw new Error(error.data.message);
      } else {
        toast.success(
          property
            ? "Property updated successfully!"
            : "Property created successfully!",
        );
      }

      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setIsLoading(false);
    }
  }

  return (
    <ClientOnly>
      {() => (
        <div className="mx-auto max-h-[80vh] overflow-y-scroll">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Post your property
            </CardTitle>
            <CardDescription>
              Enter the details below to advertise your property.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 md:gap-8"
              >
                <div className="grid gap-4">
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUpload images={images} setImages={setImages} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            id="address"
                            placeholder="1, First Street"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              id="city"
                              placeholder="Manhattan"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input
                              id="state"
                              placeholder="New York"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input id="zipCode" placeholder="10000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value.toString()}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                              <SelectContent>
                                {propertyTypes.map((type, index) => (
                                  <SelectItem
                                    key={type}
                                    value={index.toString()}
                                  >
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roomType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value.toString()}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select room type" />
                              </SelectTrigger>
                              <SelectContent>
                                {roomTypes.map((type, index) => (
                                  <SelectItem
                                    key={type}
                                    value={index.toString()}
                                  >
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input
                              id="bedrooms"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input
                              id="bathrooms"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="rentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rent Amount</FormLabel>
                        <FormControl>
                          <Input
                            id="rentAmount"
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            id="description"
                            placeholder="Describe your property..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amenities</FormLabel>
                        <FormControl>
                          <Textarea
                            id="amenities"
                            placeholder="Gym, Pool, Parking, etc. (Comma Separated)"
                            rows={3}
                            {...field}
                            onChange={(e) =>
                              form.setValue(
                                "amenities",
                                e.target.value.split(", "),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pt-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Currently Available</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <CardFooter>
                  <div className="flex justify-end w-full">
                    <Button
                      type="submit"
                      className="w-full"
                      loading={isLoading}
                    >
                      {property ? "Update Property" : "Add Property"}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </div>
      )}
    </ClientOnly>
  );
}
