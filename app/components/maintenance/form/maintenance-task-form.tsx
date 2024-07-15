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

const MaintenanceTaskSchema = z
  .object({
    requestDescription: z
      .string()
      .min(1, { message: "Description is required" }),
    requestStatus: z.enum(["0", "1", "2", "3"]),
    taskDescription: z.string().min(1, { message: "Description is required" }),
    estimatedCost: z
      .number()
      .min(0.0, { message: "Estimated cost must be non-negative" }),
    actualCost: z
      .number()
      .min(0.0, { message: "Estimated cost must be non-negative" })
      .optional(),
    taskStatus: z.enum(["0", "1", "2", "3"]),
    startDate: z.string().optional(),
    completionDate: z.string().optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.completionDate), {
    message: "Completion date must be after start date",
    path: ["completionDate"],
  });

interface MaintenanceRequestWithTasks {
  id: string;
  tenantId: string;
  propertyId: string;
  description: string;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
  propertyAddress: string;
  tenantFirstName: string;
  tenantLastName: string;
  tenantEmail: string;
  tasks: MaintenanceTask[];
}

interface MaintenanceTask {
  id: string;
  requestId: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  startDate: Date;
  completionDate: Date;
  status: MaintenanceStatus;
}

interface MaintenanceTaskFormProps extends HTMLAttributes<HTMLDivElement> {
  maintenance: MaintenanceRequestWithTasks;
  onSuccess: (updatedData: MaintenanceRequestWithTasks) => void;
  isAdmin: boolean;
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
      requestDescription: maintenance.maintenanceRequest.description || "",
      requestStatus:
        maintenance.maintenanceRequest.status.toString() || "Pending",
      taskDescription: maintenance.tasks[0]?.description || "",
      estimatedCost: maintenance.tasks[0]?.estimatedCost || 0.0,
      actualCost: maintenance.tasks[0]?.actualCost || 0.0,
      startDate: maintenance.tasks[0]?.startDate
        ? new Date(maintenance.tasks[0]?.startDate).toISOString()
        : undefined,
      completionDate: maintenance.tasks[0]?.completionDate
        ? new Date(maintenance.tasks[0]?.completionDate).toISOString()
        : undefined,
      taskStatus: maintenance.tasks[0]?.status.toString() || "Pending",
    },
  });

  useEffect(() => {
    if (maintenance) {
      form.reset({
        requestDescription: maintenance.maintenanceRequest.description,
        requestStatus: maintenance.maintenanceRequest.status.toString(),
        taskDescription: maintenance.tasks[0]?.description,
        estimatedCost: maintenance.tasks[0]?.estimatedCost,
        actualCost: maintenance.tasks[0]?.actualCost,
        startDate: maintenance.tasks[0]?.startDate
          ? new Date(maintenance.tasks[0]?.startDate).toISOString()
          : undefined,
        completionDate: maintenance.tasks[0]?.completionDate
          ? new Date(maintenance.tasks[0]?.completionDate).toISOString()
          : undefined,
        taskStatus: maintenance.tasks[0]?.status.toString(),
      });
    }
  }, [maintenance]);

  async function onSubmit(data: z.infer<typeof MaintenanceTaskSchema>) {
    try {
      setIsLoading(true);

      const payload = {
        maintenanceRequest: {
          id: maintenance.maintenanceRequest.id,
          description: data.requestDescription,
          status: parseInt(data.requestStatus),
        },
        maintenanceTask: {
          description: data.taskDescription,
          estimatedCost: data.estimatedCost,
          actualCost: data.actualCost,
          startDate: data.startDate || null,
          completionDate: data.completionDate || null,
          status: parseInt(data.taskStatus),
        },
      };

      const res = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Admin/maintenance-requests/${maintenance.maintenanceRequest.id}`,
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
        maintenanceRequestId: maintenance.maintenanceRequest.id,
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
        maintenanceRequestId: maintenance.maintenanceRequest.id,
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
        // onSuccess(payload);

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
                                <SelectItem value="0">Pending</SelectItem>
                                <SelectItem value="1">In Progress</SelectItem>
                                <SelectItem value="2">Completed</SelectItem>
                                <SelectItem value="3">Cancelled</SelectItem>
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
                                <SelectItem value="0">Pending</SelectItem>
                                <SelectItem value="1">In Progress</SelectItem>
                                <SelectItem value="2">Completed</SelectItem>
                                <SelectItem value="3">Cancelled</SelectItem>
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
                        variant="success"
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
