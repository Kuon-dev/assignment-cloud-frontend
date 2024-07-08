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
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ReviewApplicationFormProps extends HTMLAttributes<HTMLDivElement> {
  application: Application;
}

const statusType = ["Pending", "Approve", "Reject"] as const;

enum StatusType {
  Pending,
  Approved,
  Rejected,
}

const ReviewApplicationFormSchema = z.object({
  status: z.nativeEnum(StatusType, {
    required_error: "Property type is required",
  }),
});

type ReviewApplicationFormErrorSchema = {
  data: {
    message: string;
    details?: string;
    timestamp?: string;
  };
  statusCode: number;
  error: string;
  stackTrace?: string;
};

export default function ReviewApplicationForm({
  application,
  className,
  ...props
}: ReviewApplicationFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ReviewApplicationFormSchema>>({
    resolver: zodResolver(ReviewApplicationFormSchema),
    defaultValues: {
      status: StatusType.Pending,
    },
  });

  async function onSubmit(data: z.infer<typeof ReviewApplicationFormSchema>) {
    try {
      setIsLoading(true);

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZlMTczNDQxLTdjM2QtNGNjMS1iNDVkLTMyZTBjNmM3MjhjYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InRlc3QzQG1haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiT3duZXIiLCJqdGkiOiJlZGY4Njc5ZS05NGFmLTQzZGYtYjYwZC0xYTQxMGUxZDFjNjAiLCJleHAiOjE3MjA1MDg3NTYsImlzcyI6Imt1b24iLCJhdWQiOiJrdW9uIn0.RcoYDh4SDHcFSCMWqRPRy6wpMPwmItxQZG2NcaCgHEM";
      const res = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Applications/${application.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...data,
          }),
          credentials: "include",
        },
      );

      if (!res.ok) {
        const error = (await res.json()) as ReviewApplicationFormErrorSchema;
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
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Review Application</CardTitle>
        <CardDescription>
          Please fill out the form below to submit your rental application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Employment Information</Label>
                <Textarea
                  placeholder="Enter employment information"
                  value={application.employmentInfo}
                  disabled
                />
              </div>
              <div>
                <Label>References</Label>
                <Textarea
                  placeholder="Enter references"
                  value={application.references}
                  disabled
                />
              </div>
              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Enter additional notes"
                  value={application.additionalNotes}
                  disabled
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select review status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusType.map((type, index) => (
                            <SelectItem key={index} value={index.toString()}>
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
            <Button type="submit" className="mt-4" loading={isLoading}>
              Submit Review
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
