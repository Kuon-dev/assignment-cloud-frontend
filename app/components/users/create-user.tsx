import { HTMLAttributes, useState } from "react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "@remix-run/react";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { ClientOnly } from "remix-utils/client-only";
import { showErrorToast } from "@/lib/handle-error";

interface AddUserFormProps extends HTMLAttributes<HTMLDivElement> {}

const userFormSchema = z.object({
  firstName: z.string().min(1, { message: "Please enter your first name" }),
  lastName: z.string().min(1, { message: "Please enter your last name" }),
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(7, { message: "Password must be at least 7 characters long" }),
  role: z.enum(["0", "1", "2"], { message: "Please select a role" }),
});

export default function AddUserForm({ className, ...props }: AddUserFormProps) {
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof userFormSchema>) {
    try {
      setIsLoading(true);
      const formData = {
        ...data,
        role: parseInt(data.role),
      };
      const res = await fetch(`${window.ENV?.BACKEND_URL}/api/Admin/users`, {
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
      toast.success("User added successfully!");
      navigate("/users");
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      }
      setIsLoading(false);
    }
  }

  return (
    <ClientOnly>
      {() => (
        <div className={cn("grid gap-6", className)} {...props}>
          <div className="container mx-auto p-4 flex-grow border">
            <h1 className="text-2xl font-bold mb-6 text-center">Create User</h1>
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
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
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
                    Add User
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </ClientOnly>
  );
}
