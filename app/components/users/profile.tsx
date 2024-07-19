import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/stores/admin-store";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/handle-error";

const profileFormSchema = z
  .object({
    firstName: z.string().min(1, { message: "Please enter your first name" }),
    lastName: z.string().min(1, { message: "Please enter your last name" }),
    phoneNumber: z
      .string()
      .min(10, { message: "Please enter a valid phone number" }),
    profilePicture: z.any(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmNewPassword) {
        return data.newPassword === data.confirmNewPassword;
      }
      return true;
    },
    {
      message: "New passwords must match",
      path: ["confirmNewPassword"],
    },
  );

type ProfileFormSchema = z.infer<typeof profileFormSchema>;

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl: string;
  currentPassword?: string;
  newPassword?: string;
}

export default function ProfileComponent() {
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const [userData, setUserData] = useAdminStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    userData?.profilePictureUrl || null,
  );

  const form = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      phoneNumber: userData?.phoneNumber || "",
      profilePicture: null,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    form.setValue("firstName", userData?.firstName || "");
    form.setValue("lastName", userData?.lastName || "");
    form.setValue("phoneNumber", userData?.phoneNumber || "");
  }, [userData, form]);

  const uploadProfilePicture = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${window.ENV.BACKEND_URL}/api/users/profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }

      const result = await response.json();
      return result.imageUrl;
    } catch (error) {
      showErrorToast(error);
      return null;
    }
  };

  const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    let profilePictureUrl: string = userData?.profilePictureUrl || "";
    if (profilePicture) {
      const uploadedImageUrl = await uploadProfilePicture(profilePicture);
      if (!uploadedImageUrl) {
        toast.error("Failed to upload profile picture");
        return;
      }
      profilePictureUrl = uploadedImageUrl;
    }

    const formData: ProfileFormData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      profilePictureUrl: profilePictureUrl || "",
    };

    if (data.newPassword) {
      formData.currentPassword = data.currentPassword;
      formData.newPassword = data.newPassword;
    }

    try {
      const response = await fetch(
        `${window.ENV.BACKEND_URL}/api/users/profile`,
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
        const result = await response.json();
        toast.error("Failed to update profile" + result[0].description);
        return;
      }
      setUserData({
        id: userData?.id,
        email: userData?.email,
        firstName: data.firstName,
        isVerified: userData?.isVerified,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        profilePictureUrl: profilePictureUrl || "",
        role: userData?.role,
        admin: userData?.admin,
        owner: userData?.owner,
        tenant: userData?.tenant,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container mx-auto p-4 flex-grow">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormItem className="space-y-1 w-24">
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="relative mb-2 h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile Preview"
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="h-8 w-8 text-gray-500" />
                        <span className="text-xs text-black">
                          No file chosen
                        </span>
                      </div>
                    )}
                  </div>
                  <Input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </label>
              </FormControl>
            </FormItem>
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem className="space-y-1">
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input
                  value={
                    userData?.role === 0
                      ? "Tenant"
                      : userData?.role === 1
                        ? "Owner"
                        : userData?.role === 2
                          ? "Admin"
                          : "undefined"
                  }
                  readOnly
                />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Current Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm New Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
