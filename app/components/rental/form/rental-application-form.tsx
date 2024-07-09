import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Button } from "@/components/custom/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const RentalApplicationSchema = z.object({
  employmentInfo: z
    .string()
    .min(1, { message: "Employment details are required" }),
  references: z.string().min(1, { message: "References are required" }),
  additionalNotes: z.string().optional(),
});

interface RentalApplicationFormProps extends HTMLAttributes<HTMLDivElement> {
  tenantId: string;
  listingId: string;
}

type RentalApplicationFormErrorSchema = {
  data: {
    message: string;
    details?: string;
    timestamp?: string;
  };
  statusCode: number;
  error: string;
  stackTrace?: string;
};

export default function RentalApplicationForm({
  tenantId,
  listingId,
  className,
  ...props
}: RentalApplicationFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof RentalApplicationSchema>>({
    resolver: zodResolver(RentalApplicationSchema),
    defaultValues: {
      employmentInfo: "",
      references: "",
      additionalNotes: "",
    },
  });

  async function onSubmit(data: z.infer<typeof RentalApplicationSchema>) {
    try {
      setIsLoading(true);

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImM5YWEyMzdmLTE0MWMtNGNiYi04ODM3LWJkYWQ3OGE0NDU0ZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InRlc3QzQG1haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVGVuYW50IiwianRpIjoiODE0OGFhNDYtYzJmZi00YzFhLTg4ZTktNTQxM2ZjYzIwYTg2IiwiZXhwIjoxNzIwMzU0ODQwLCJpc3MiOiJrdW9uIiwiYXVkIjoia3VvbiJ9.9qaxzG2L3Q8wX0PfoLZwYGWpsdlZJdMuObH7okXjsEM";
      const res = await fetch(`${window.ENV?.BACKEND_URL}/api/Applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          listingId,
          ...data,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = (await res.json()) as RentalApplicationFormErrorSchema;
        throw new Error(error.data.message);
      } else {
        toast.success("Application submitted successfully!");
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
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="employmentInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter employment information"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="references"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>References</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter references" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter additional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="mt-4" loading={isLoading}>
            Submit Application
          </Button>
        </form>
      </Form>
    </div>
  );
}
