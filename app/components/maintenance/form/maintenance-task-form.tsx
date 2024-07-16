import React, { HTMLAttributes, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { DatePicker } from "@/components/custom/date.picker.client";
import { useAdminStore } from "@/stores/admin-store";

interface MaintenanceTaskFormProps extends HTMLAttributes<HTMLDivElement> {
  maintenance?: Maintenance;
  onSuccess: (updatedData: Maintenance) => void;
  isAdmin: boolean;
}

const maintenanceStatus = [
  "Pending",
  "InProgress",
  "Completed",
  "Cancelled",
] as const;

enum MaintenanceStatus {
  Pending = 0,
  InProgress,
  Completed,
  Cancelled,
}

const MaintenanceTaskSchema = z
  .object({
    requestDescription: z
      .string()
      .min(1, { message: "Description is required" }),
    requestStatus: z.enum(["Pending", "InProgress", "Completed", "Cancelled"], {
      message: "Status is required",
    }),
    taskDescription: z.string().min(1, { message: "Description is required" }),
    estimatedCost: z
      .number()
      .min(0.0, { message: "Estimated cost must be non-negative" }),
    actualCost: z
      .number()
      .min(0.0, { message: "Estimated cost must be non-negative" })
      .optional(),
    taskStatus: z.enum(["Pending", "InProgress", "Completed", "Cancelled"], {
      message: "Status is required",
    }),
    startDate: z.string().optional(),
    completionDate: z.string().optional(),
  })
  .refine(
    (data) => {
      const startDate = data.startDate ? new Date(data.startDate) : null;
      const completionDate = data.completionDate
        ? new Date(data.completionDate)
        : null;
      if (startDate && completionDate) {
        return startDate < completionDate;
      }
      return true;
    },
    {
      message: "Completion date must be after start date",
      path: ["completionDate"],
    },
  );

export default function MaintenanceTaskForm({
  maintenance,
  onSuccess,
  isAdmin,
  className,
  ...props
}: MaintenanceTaskFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const [userData] = useAdminStore((state) => [state.userData]);

  const form = useForm<z.infer<typeof MaintenanceTaskSchema>>({
    resolver: zodResolver(MaintenanceTaskSchema),
    defaultValues: {
      requestDescription: maintenance?.maintenanceRequest.description || "",
      requestStatus:
        maintenance?.maintenanceRequest.status !== undefined
          ? MaintenanceStatus[maintenance?.maintenanceRequest.status]
          : "Pending",
      taskDescription: maintenance?.tasks[0]?.description || "",
      estimatedCost: maintenance?.tasks[0]?.estimatedCost || 0.0,
      actualCost: maintenance?.tasks[0]?.actualCost || 0.0,
      startDate: maintenance?.tasks[0]?.startDate
        ? new Date(maintenance?.tasks[0]?.startDate).toISOString()
        : undefined,
      completionDate: maintenance?.tasks[0]?.completionDate
        ? new Date(maintenance?.tasks[0]?.completionDate).toISOString()
        : undefined,
      taskStatus:
        maintenance?.tasks[0]?.status !== undefined
          ? MaintenanceStatus[maintenance?.tasks[0]?.status]
          : "Pending",
    },
  });

  useEffect(() => {
    if (maintenance) {
      form.reset({
        requestDescription: maintenance?.maintenanceRequest.description,
        requestStatus:
          maintenance?.maintenanceRequest.status !== undefined
            ? MaintenanceStatus[maintenance?.maintenanceRequest.status]
            : "Pending",
        taskDescription: maintenance?.tasks[0]?.description,
        estimatedCost: maintenance?.tasks[0]?.estimatedCost,
        actualCost: maintenance?.tasks[0]?.actualCost,
        startDate: maintenance?.tasks[0]?.startDate
          ? new Date(maintenance?.tasks[0]?.startDate).toISOString()
          : undefined,
        completionDate: maintenance?.tasks[0]?.completionDate
          ? new Date(maintenance?.tasks[0]?.completionDate).toISOString()
          : undefined,
        taskStatus:
          maintenance?.tasks[0]?.status !== undefined
            ? MaintenanceStatus[maintenance?.tasks[0]?.status]
            : "Pending",
      });
    }
  }, [maintenance]);

  const statusToEnum = (status: string): number => {
    return MaintenanceStatus[status as keyof typeof MaintenanceStatus];
  };

  const enumToStatus = (enumValue: number): string => {
    return MaintenanceStatus[enumValue] as string;
  };

  async function onSubmit(data: z.infer<typeof MaintenanceTaskSchema>) {
    try {
      setIsLoading(true);
      const payload = {
        maintenanceRequest: {
          id: maintenance?.maintenanceRequest.id,
          description: data.requestDescription,
          status: statusToEnum(data.requestStatus),
        },
        maintenanceTask: {
          description: data.taskDescription,
          estimatedCost: data.estimatedCost,
          actualCost: data.actualCost,
          startDate: data.startDate || null,
          completionDate: data.completionDate || null,
          status: statusToEnum(data.taskStatus),
        },
      };
      console.log(payload);
      const res = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Admin/maintenance-requests/${maintenance?.maintenanceRequest.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        },
      );
      if (res.ok) {
        setIsLoading(false);
        window.location.reload();
        toast.success(`Maintenance request updated successfully!`);
      }
    } catch (error) {
      console.error("Error updating maintenance request:", error);
      toast.error("Error updating maintenance request.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove() {
    try {
      setIsLoading(true);
      const payload = {
        ownerId: userData?.id,
        maintenanceRequestId: maintenance?.maintenanceRequest.id,
        approve: true,
      };
      const res = await fetch(
        `${window.ENV?.BACKEND_URL}/api/users/owner/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        setIsLoading(false);
        window.location.reload();
        toast.success(`Maintenance request updated successfully!`);
      }
    } catch (error) {
      console.error("Error approving maintenance request:", error);
      toast.error("Error approving maintenance request.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReject() {
    try {
      setIsLoading(true);
      const payload = {
        ownerId: userData?.id,
        maintenanceRequestId: maintenance?.maintenanceRequest.id,
        approve: false,
      };
      const res = await fetch(
        `${window.ENV?.BACKEND_URL}/api/users/owner/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (res.ok) {
        setIsLoading(false);
        window.location.reload();
        toast.success(`Maintenance request updated successfully!`);
      }
    } catch (error) {
      console.error("Error rejecting maintenance request:", error);
      toast.error("Error rejecting maintenance request.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ClientOnly>
      {() => (
        <div
          className={cn(
            "grid gap-6 w-full max-w-lg mx-auto custom-scrollbar",
            className,
          )}
          {...props}
        >
          <Card>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="requestDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Request Description</FormLabel>
                          <FormControl>
                            <Textarea
                              className="custom-scrollbar"
                              placeholder="Enter request description"
                              {...field}
                              readOnly={!isAdmin}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requestStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Request Status</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!isAdmin}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {maintenanceStatus.map((status, index) => (
                                  <SelectItem key={index} value={status}>
                                    {status}
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
                      name="taskDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter task description"
                              {...field}
                              readOnly={!isAdmin}
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
                              step="any"
                              placeholder="Enter estimated cost"
                              {...field}
                              readOnly={!isAdmin}
                              onChange={(e) =>
                                field.onChange(
                                  parseFloat(
                                    parseFloat(e.target.value).toFixed(2),
                                  ),
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
                      name="actualCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Actual Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              placeholder="Enter actual cost"
                              {...field}
                              readOnly={!isAdmin}
                              onChange={(e) =>
                                field.onChange(
                                  parseFloat(
                                    parseFloat(e.target.value).toFixed(2),
                                  ),
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
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              name="startDate"
                              label=""
                              control={form.control}
                              error={form.formState.errors.startDate}
                              disabled={!isAdmin}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="completionDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Completion Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              name="completionDate"
                              label=""
                              control={form.control}
                              error={form.formState.errors.completionDate}
                              disabled={!isAdmin}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="taskStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Status</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={!isAdmin}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {maintenanceStatus.map((status, index) => (
                                  <SelectItem key={index} value={status}>
                                    {status}
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
                </CardContent>
                <CardFooter>
                  {!isAdmin ? (
                    <div className="flex justify-between w-full">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleReject}
                      >
                        Reject
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApprove}
                      >
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <Button type="submit" loading={isLoading}>
                      Save Changes
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      )}
    </ClientOnly>
  );
}

const customScrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar{
        width: 6px;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track{
        background: none;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb{ 
        background: rgb(255 255 255 / 10%);
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover{ 
        background: rgb(255 255 255 / 15%);
    }
`;

if (typeof window !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = customScrollbarStyles;
  document.head.appendChild(styleElement);
}
