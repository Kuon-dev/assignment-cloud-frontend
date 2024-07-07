import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ClientOnly } from "remix-utils/client-only";

import {
  Card,
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

interface PropertyFormProps extends HTMLAttributes<HTMLDivElement> {
  ownerId: string;
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

export default function CreatePropertyForm({
  ownerId,
  className,
  ...props
}: PropertyFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PropertyFormSchema>>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      propertyType: PropertyType.Apartment,
      roomType: RoomType.MasterBedroom,
      bedrooms: 1,
      bathrooms: 1,
      rentAmount: 1000,
      description: "",
      amenities: [],
      isAvailable: true,
    },
  });

  async function onSubmit(data: z.infer<typeof PropertyFormSchema>) {
    try {
      setIsLoading(true);

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjdjNzBlMzI5LTE3NGQtNDVjYi05MTUwLWNjZTZlMGY0ZThjYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InRlc3QyQG1haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiT3duZXIiLCJqdGkiOiJhYTc1MjE0ZS01MmZkLTRiMjUtOGUxOC03OWY0YTMzODY3OGQiLCJleHAiOjE3MjAzMzU4ODcsImlzcyI6Imt1b24iLCJhdWQiOiJrdW9uIn0.8mhBtOo4gkOh6xEEqAOkq8c2AwIHcQYiSf8nsWqR4bc";
      const res = await fetch(`${window.ENV?.BACKEND_URL}/api/property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
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
        toast.success("Property listed successfully!");
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
    <ClientOnly>
      {() => (
        <div className={cn("mx-auto", className)} {...props}>
          <Card>
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
                            <Input
                              id="zipCode"
                              placeholder="10000"
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
                        {isLoading ? "Listing Property..." : "List Property"}
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </ClientOnly>
  );
}
