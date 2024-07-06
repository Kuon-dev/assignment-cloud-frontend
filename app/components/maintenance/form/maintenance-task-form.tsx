import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ClientOnly } from "remix-utils/client-only";

import { Button } from "@/components/custom/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const MaintenanceTaskSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  estimatedCost: z
    .number()
    .min(0, { message: "Estimated cost must be non-negative" }),
});

interface MaintenanceTaskFormProps extends HTMLAttributes<HTMLDivElement> {
  requestId: string;
}

type MaintenanceTaskFormErrorSchema = {
  data: {
    message: string;
    details?: string;
    timestamp?: string;
  };
  statusCode: number;
  error: string;
  stackTrace?: string;
};

export default function MaintenanceTaskForm({
  requestId,
  className,
  ...props
}: MaintenanceTaskFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof MaintenanceTaskSchema>>({
    resolver: zodResolver(MaintenanceTaskSchema),
    defaultValues: {
      description: "",
      estimatedCost: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof MaintenanceTaskSchema>) {
    try {
      setIsLoading(true);

      const token = "user_token";
      const res = await fetch(
        `${window.ENV?.BACKEND_URL}/api/MaintenanceTask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requestId,
            ...data,
          }),
          credentials: "include",
        },
      );

      if (!res.ok) {
        const error = (await res.json()) as MaintenanceTaskFormErrorSchema;
        throw new Error(error.data.message);
      } else {
        toast.success("Maintenance task created successfully!");
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
        <div className={cn("grid gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Create Maintenance Task
              </CardTitle>
              <CardDescription>
                Enter the details below to create a maintenance task.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                              placeholder="Enter task description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="estimatedCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter estimated cost"
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
                </CardContent>
                <CardFooter>
                  <Button type="submit" loading={isLoading}>
                    Submit Task
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      )}
    </ClientOnly>
  );
}
