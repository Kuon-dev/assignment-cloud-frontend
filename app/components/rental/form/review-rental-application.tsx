import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { useDashboardStore } from "@/stores/dashboard-store";

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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LeaseForm from "@/components/lease/form/lease-form";

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
  const user = useDashboardStore((state) => state.user);
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ReviewApplicationFormSchema>>({
    resolver: zodResolver(ReviewApplicationFormSchema),
    defaultValues: {
      status: application ? parseInt(application.status) : StatusType.Pending,
    },
  });

  async function onSubmit(data: z.infer<typeof ReviewApplicationFormSchema>) {
    try {
      setIsLoading(true);

      const res = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Applications/${application.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mb-4"
          >
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
                        disabled={!!user?.tenant}
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
            {user?.owner &&
              parseInt(application.status) === StatusType.Pending && (
                <Button type="submit" className="mt-4" loading={isLoading}>
                  Submit Review
                </Button>
              )}
          </form>
        </Form>
        {user?.tenant &&
          parseInt(application.status) === StatusType.Approved && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Lease Now</Button>
              </DialogTrigger>
              <DialogContent>
                <LeaseForm
                  tenantId={user.tenant.id}
                  propertyId={application.propertyId}
                />
              </DialogContent>
            </Dialog>
          )}
      </CardContent>
    </div>
  );
}
