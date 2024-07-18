import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ClientOnly } from "remix-utils/client-only";
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
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { Label } from "@/components/ui/label";
import { showErrorToast } from "@/lib/handle-error";

const MaintenanceRequestSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

interface MaintenanceRequestFormProps extends HTMLAttributes<HTMLDivElement> {
  maintenance?: Maintenance;
  propertyId?: string;
}

type MaintenanceRequestFormErrorSchema = {
  data: {
    message: string;
    details?: string;
    timestamp?: string;
  };
  statusCode: number;
  error: string;
  stackTrace?: string;
};

const statusType = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

export default function MaintenanceRequestForm({
  maintenance,
  propertyId,
  className,
  ...props
}: MaintenanceRequestFormProps) {
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof MaintenanceRequestSchema>>({
    resolver: zodResolver(MaintenanceRequestSchema),
    defaultValues: {
      description: maintenance?.maintenanceRequest.description || "",
    },
  });

  async function onSubmit(data: z.infer<typeof MaintenanceRequestSchema>) {
    try {
      setIsLoading(true);

      const res = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Maintenance/requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            propertyId,
            ...data,
          }),
          credentials: "include",
        },
      );

      if (!res.ok) {
        const error = (await res.json()) as MaintenanceRequestFormErrorSchema;
        throw new Error(error.data.message);
      } else {
        toast.success("Property listed successfully!");
      }
      setIsLoading(false);
    } catch (error) {
      showErrorToast(error);
      setIsLoading(false);
    }
  }

  return (
    <ClientOnly>
      {() => (
        <div className={cn("grid gap-6", className)} {...props}>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {maintenance ? "Review" : "Create"} Maintenance Request
            </CardTitle>
            <CardDescription>
              {maintenance
                ? "Review your maintenance request details"
                : "Create a new maintenance request"}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter maintenance issue description"
                            {...field}
                            disabled={!!maintenance}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {maintenance && (
                    <>
                      <Label>Status</Label>
                      <Select
                        value={maintenance.maintenanceRequest.status.toString()}
                        disabled={!!maintenance}
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
                    </>
                  )}
                </div>
              </CardContent>
              {!maintenance && (
                <CardFooter>
                  <Button type="submit" loading={isLoading}>
                    Submit Request
                  </Button>
                </CardFooter>
              )}
            </form>
          </Form>
        </div>
      )}
    </ClientOnly>
  );
}
