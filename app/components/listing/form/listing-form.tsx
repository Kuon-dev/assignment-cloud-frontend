import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ClientOnly } from "remix-utils/client-only";
import { getAuthTokenFromCookie } from "@/lib/router-guard";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/custom/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/custom/date.picker.client";
import { Label } from "@/components/ui/label";

interface ListingFormProps {
  listing?: Listing;
  property?: Property;
}

type ListingsFormErrorSchema = {
  data: {
    message: string;
    details?: string;
    timestamp?: string;
  };
  statusCode: number;
  error: string;
  stackTrace?: string;
};

const ListingFormSchema = z.object({
  title: z.string().min(1, { message: "Please enter the title" }),
  description: z.string().min(10, {
    message: "Please enter the description of minimum 10 characters",
  }),
  price: z.number().min(1, { message: "Please enter a valid price" }),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  isActive: z.boolean().optional(),
});

export default function ListingForm({ listing, property }: ListingFormProps) {
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ListingFormSchema>>({
    resolver: zodResolver(ListingFormSchema),
    defaultValues: {
      title: listing?.title || "",
      description: listing?.description || "",
      price: listing?.price || 0,
      startDate: listing?.startDate || undefined,
      endDate: listing?.endDate || undefined,
      isActive: listing?.isActive || false,
    },
  });

  const onSubmit = async (data: z.infer<typeof ListingFormSchema>) => {
    try {
      setIsLoading(true);

      const url = listing
        ? `${window.ENV?.BACKEND_URL}/api/Listings/${listing.id}`
        : `${window.ENV?.BACKEND_URL}/api/Listings`;
      const res = await fetch(url, {
        method: listing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          propertyId: property?.id,
          ...data,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = (await res.json()) as ListingsFormErrorSchema;
        throw new Error(error.data.message);
      } else {
        toast.success("Property listed successfully");
      }
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        toast.error(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <ClientOnly>
      {() => (
        <div className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-1">
                      <Label>Property</Label>
                    </div>
                    <Input
                      placeholder="Property"
                      disabled
                      value={listing?.location ?? property?.address}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Price"
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
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    name="startDate"
                    control={form.control}
                    label="Start Date"
                    error={form.formState.errors.startDate}
                    disabled={!!listing}
                  />
                  <DatePicker
                    name="endDate"
                    control={form.control}
                    label="End Date"
                    error={form.formState.errors.endDate}
                    disabled={!!listing}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Set Active</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end w-full">
                <Button type="submit" loading={isLoading}>
                  {listing ? "Update List" : "List Property"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </ClientOnly>
  );
}
