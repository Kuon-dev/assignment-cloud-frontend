import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { useAdminStore } from "@/stores/admin-store";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { toast } from "sonner";
import { useNavigate } from "@remix-run/react";
import { showErrorToast } from "@/lib/handle-error";

const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: "Please enter your first name" }),
  lastName: z.string().min(1, { message: "Please enter your last name" }),
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  role: z.enum(["0", "1", "2"], { message: "Please select a role" }),
});

export default function EditUserComponent() {
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const [editingData, setEditingData] = useAdminStore((state) => [
    state.editingData,
    state.setEditingData,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const defaultValues = {
    firstName: editingData?.firstName || "",
    lastName: editingData?.lastName || "",
    email: editingData?.email || "",
    role: editingData?.role !== undefined ? editingData.role.toString() : "",
  };

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof profileFormSchema>) {
    try {
      setIsLoading(true);
      const formData = {
        ...data,
        role: data.role,
        user: editingData.id,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Admin/users/${editingData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      toast.success("User updated successfully!");
      navigate("/users");
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 flex-grow border">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit User</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <div className="flex space-x-4">
                      <label>
                        <input
                          type="radio"
                          value="0"
                          checked={field.value === "0"}
                          onChange={() => field.onChange("0")}
                        />
                        Tenant
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="1"
                          checked={field.value === "1"}
                          onChange={() => field.onChange("1")}
                        />
                        Owner
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="2"
                          checked={field.value === "2"}
                          onChange={() => field.onChange("2")}
                        />
                        Admin
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
