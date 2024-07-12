import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
//import { ClientOnly } from "remix-utils/client-only";
import { z } from "zod";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Card,
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
//import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { Switch } from "@radix-ui/react-switch";
import { Badge, X } from "lucide-react";
import React, { useState } from "react";
import { Spinner } from "@/components/custom/spinner";
import SearchAddress from "@/components/custom/search-address.client";

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

interface PropertyFormProps {
  ownerId?: string;
  property?: Property;
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

  const [amenitiesInput, setAmenitiesInput] = React.useState("");
  const form = useForm<z.infer<typeof PropertyFormSchema>>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      address: property?.address || "",
      city: property?.city || "",
      state: property?.state || "",
      zipCode: property?.zipCode || "",
      propertyType: property?.propertyType || PropertyType.Apartment,
      roomType: property?.roomType,
      bedrooms: property?.bedrooms || 1,
      bathrooms: property?.bathrooms || 1,
      rentAmount: property?.rentAmount || 0,
      description: property?.description || "",
      amenities: property?.amenities || [],
      isAvailable: property?.isAvailable || false,
    },
  });

  const handleAmenitiesInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAmenitiesInput(e.target.value);
  };

  const handleAmenitiesInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "," && amenitiesInput.trim()) {
      e.preventDefault();
      const newAmenity = amenitiesInput.trim();
      if (!form.getValues().amenities?.includes(newAmenity)) {
        form.setValue("amenities", [
          ...(form.getValues().amenities ?? ""),
          newAmenity,
        ]);
      }
      setAmenitiesInput("");
    }
  };

  const removeAmenity = (amenity: string) => {
    form.setValue(
      "amenities",
      form.getValues().amenities?.filter((a: string) => a !== amenity),
    );
  };

  async function onSubmit(data: z.infer<typeof PropertyFormSchema>) {
    try {
      setIsLoading(true);

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
        console.error(error);
        toast.error(error.message);
      }
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          Create a New Property
        </CardTitle>
        <CardDescription>
          Fill out the details below to list your property.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <SearchAddress
                          onSelectLocation={(location) => {
                            form.setValue("address", location?.label ?? "");
                          }}
                          defaultValue={field.value}
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
                          <Input placeholder="San Francisco" {...field} />
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
                          <Input placeholder="CA" {...field} />
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
                        <Input placeholder="94101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                              <SelectItem key={type} value={index.toString()}>
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input
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
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
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
                        <div>
                          <Input
                            placeholder="Type amenity and press comma"
                            value={amenitiesInput}
                            onChange={handleAmenitiesInputChange}
                            onKeyDown={handleAmenitiesInputKeyDown}
                          />
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.value?.map((amenity, index) => (
                              <Badge
                                key={index}
                                className="flex items-center gap-1"
                              >
                                {amenity}
                                <X
                                  size={14}
                                  className="cursor-pointer"
                                  onClick={() => removeAmenity(amenity)}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Is Available
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
                              <SelectItem key={type} value={index.toString()}>
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
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <span>Create Property</span>
              <Spinner />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
