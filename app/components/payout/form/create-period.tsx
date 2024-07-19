import React, { HTMLAttributes, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ClientOnly } from "remix-utils/client-only";

import { Button } from "@/components/custom/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { useNavigate } from "@remix-run/react";
import { DatePicker } from "@/components/custom/date.picker.client";
import { showErrorToast } from "@/lib/handle-error";

const NewPeriodSchema = z
  .object({
    startDate: z.string({ required_error: "Start Date is required" }),
    endDate: z.string({ required_error: "End Date is required" }),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

interface NewPeriodFormProps extends HTMLAttributes<HTMLDivElement> {}

export default function NewPeriodForm({
  className,
  ...props
}: NewPeriodFormProps) {
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(NewPeriodSchema),
  });

  async function onSubmit(data: z.infer<typeof NewPeriodSchema>) {
    try {
      setIsLoading(true);
      const formData = {
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };
      const res = await fetch(`${window.ENV?.BACKEND_URL}/api/Payout/periods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      setIsLoading(false);
      toast.success("Payout period created successfully!");
      navigate("/payout");
    } catch (error) {
      showErrorToast(error);
      setIsLoading(false);
    }
  }

  return (
    <ClientOnly>
      {() => (
        <div className="flex-grow">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <h1 className="text-2xl font-bold mb-6 text-center py-4">
                  Create Payout Period
                </h1>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Controller
                              name="startDate"
                              control={form.control}
                              render={({ field }) => (
                                <DatePicker
                                  name="startDate"
                                  control={form.control}
                                  error={form.formState.errors.startDate}
                                  onChange={(date) => field.onChange(date)}
                                />
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Controller
                              name="endDate"
                              control={form.control}
                              render={({ field }) => (
                                <DatePicker
                                  name="endDate"
                                  control={form.control}
                                  error={form.formState.errors.endDate}
                                  onChange={(date) => field.onChange(date)}
                                />
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Period"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      )}
    </ClientOnly>
  );
}
