import { useState, HTMLAttributes } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ClientOnly } from "remix-utils/client-only";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/custom/date.picker.client";

interface ImageFile extends File {
  preview: string;
}

interface ListingFormProps extends HTMLAttributes<HTMLDivElement> {}

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
  description: z.string().min(1, { message: "Please enter the description" }),
  property: z.string().min(1, { message: "Please select a property" }),
  price: z.number().min(1, { message: "Please enter a valid price" }),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  isActive: z.boolean().optional(),
});

export default function ListingForm({ className, ...props }: ListingFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ListingFormSchema>>({
    resolver: zodResolver(ListingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      // property: "",
      price: 0,
      startDate: undefined,
      endDate: undefined,
      isActive: true,
    },
  });

  const properties = ["Property 1", "Property 2", "Property 3", "Property 4"];

  const onSubmit = async (data: z.infer<typeof ListingFormSchema>) => {
    try {
      setIsLoading(true);

      const token =
        "eyJhbGciOiJIUzcCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjdjNzBlMzI5LTE3NGQtNDVjYi05MTUwLWNjZTZlMGY0ZThjYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InRlc3QyQG1haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiT3duZXIiLCJqdGkiOiI3NGNkNDJiOC1lODhhLTRlZTktOTYzOC0yN2I2ZWE2NmZiMTEiLCJleHAiOjE3MjAzNjE0ODEsImlzcyI6Imt1b24iLCJhdWQiOiJrdW9uIn0.yJPooh0njPgRm-9Sx4NkX6soVAVm_8j6Zj8Aze-Se40";
      const propertyId = "174599ab-a263-4168-ae49-45073715ab71";
      const res = await fetch(`${window.ENV?.BACKEND_URL}/api/Listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId,
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
        <div className={cn("grid gap-6", className)} {...props}>
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
                  <FormField
                    control={form.control}
                    name="property"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Property</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="border rounded-md p-2 w-full">
                              <SelectValue placeholder="Select a property" />
                            </SelectTrigger>
                            <SelectContent>
                              {properties.map((prop, index) => (
                                <SelectItem key={index} value={prop}>
                                  {prop}
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
                  />
                  <DatePicker
                    name="endDate"
                    control={form.control}
                    label="End Date"
                    error={form.formState.errors.endDate}
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
                  List Property
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </ClientOnly>
  );
}