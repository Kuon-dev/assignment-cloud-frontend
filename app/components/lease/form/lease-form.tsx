import { HTMLAttributes, useState } from "react";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface LeaseFormProps extends HTMLAttributes<HTMLDivElement> {
  tenantId: string;
  propertyId: string;
}

type LeaseFormErrorSchema = {
  data: {
    message: string;
    details?: string;
    timestamp?: string;
  };
  statusCode: number;
  error: string;
  stackTrace?: string;
};

const LeaseFormSchema = z.object({
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  rentAmount: z
    .number()
    .min(0, { message: "Rent amount must be non-negative" }),
  securityDeposit: z
    .number()
    .min(0, { message: "Security deposit must be non-negative" }),
  isActive: z.boolean(),
});

export default function LeaseForm({
  tenantId,
  propertyId,
  className,
  ...props
}: LeaseFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LeaseFormSchema>>({
    resolver: zodResolver(LeaseFormSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      rentAmount: 0,
      securityDeposit: 0,
      isActive: true,
    },
  });

  async function onSubmit(data: z.infer<typeof LeaseFormSchema>) {
    try {
      setIsLoading(true);

      const token = "jwt_token";
      const res = await fetch(`${window.ENV?.BACKEND_URL}/api/Lease`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId,
          propertyId,
          ...data,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = (await res.json()) as LeaseFormErrorSchema;
        throw new Error(error.data.message);
      } else {
        toast.success("Lease created successfully!");
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
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Create Lease</CardTitle>
            <CardDescription>
              Enter the details below to create a new lease.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-6 md:gap-8"
              >
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="startDate"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start font-normal"
                                >
                                  <CalendarDays className="w-5" />
                                  <span className="ml-3">
                                    {field.value
                                      ? format(new Date(field.value), "PPP")
                                      : "Select date"}
                                  </span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    field.onChange(
                                      date ? date.toISOString() : undefined,
                                    );
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      name="endDate"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start font-normal"
                                >
                                  <CalendarDays className="w-5" />
                                  <span className="ml-3">
                                    {field.value
                                      ? format(new Date(field.value), "PPP")
                                      : "Select date"}
                                  </span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? new Date(field.value)
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    field.onChange(
                                      date ? date.toISOString() : undefined,
                                    );
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                      name="securityDeposit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security Deposit</FormLabel>
                          <FormControl>
                            <Input
                              id="securityDeposit"
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
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pt-4">
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
                <CardFooter>
                  <div className="flex justify-end w-full">
                    <Button
                      type="submit"
                      className="w-full"
                      loading={isLoading}
                    >
                      {isLoading ? "Creating Lease..." : "Create Lease"}
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
