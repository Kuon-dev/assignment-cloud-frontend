import { toast } from "sonner";
import { z } from "zod";

const backendURL =
  typeof window !== "undefined"
    ? window.ENV.BACKEND_URL
    : process.env.BACKEND_URL;

/**
 * Zod schema for user information DTO
 */
const UserInfoDtoSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["Admin", "Owner", "Tenant"]),
  isVerified: z.boolean(),
  profilePictureUrl: z.string().url().optional(),
  owner: z.object({ id: z.string().uuid() }).optional(),
  tenant: z.object({ id: z.string().uuid() }).optional(),
  admin: z.object({ id: z.string().uuid() }).optional(),
});

/**
 * Type for user information DTO
 */
type UserInfoDto = z.infer<typeof UserInfoDtoSchema>;

/**
 * Zod schema for creating a new user
 */
const CreateUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["Admin", "Owner", "Tenant"]),
});

/**
 * Type for creating a new user
 */
type CreateUserData = z.infer<typeof CreateUserSchema>;

/**
 * Zod schema for updating a user
 */
const UpdateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(["Admin", "Owner", "Tenant"]).optional(),
  isVerified: z.boolean().optional(),
});

/**
 * Type for updating a user
 */
type UpdateUserData = z.infer<typeof UpdateUserSchema>;

/**
 * Shows an error toast with the given error message
 * @param error - The error object or message
 */
const showErrorToast = (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  toast.error(errorMessage);
};

/**
 * Fetches all users with pagination
 * @param page - The page number
 * @param size - The number of items per page
 * @returns An array of UserInfoDto or null if an error occurs
 */
export const getUsers = async (
  page: number = 1,
  size: number = 10,
): Promise<UserInfoDto[] | null> => {
  try {
    const response = await fetch(
      `${backendURL}/api/users?page=${page}&size=${size}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message);
    }
    return UserInfoDtoSchema.array().parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};

/**
 * Fetches a specific user by ID
 * @param id - The user ID
 * @returns A UserInfoDto or null if an error occurs
 */
export const getUser = async (id: string): Promise<UserInfoDto | null> => {
  try {
    const response = await fetch(`${backendURL}/api/users/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message);
    }
    return UserInfoDtoSchema.parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};

/**
 * Creates a new user
 * @param data - The user data to create
 * @returns A UserInfoDto of the created user or null if an error occurs
 */
export const createUser = async (
  data: CreateUserData,
): Promise<UserInfoDto | null> => {
  try {
    const validatedData = CreateUserSchema.parse(data);
    const response = await fetch(`${backendURL}/api/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });
    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message);
    }
    const createdUser = UserInfoDtoSchema.parse(res);
    toast.success("User created successfully.");
    return createdUser;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      showErrorToast(
        "Invalid user data: " + error.errors.map((e) => e.message).join(", "),
      );
    } else {
      showErrorToast(error);
    }
    return null;
  }
};

/**
 * Updates an existing user
 * @param id - The user ID
 * @param data - The user data to update
 * @returns A boolean indicating success or failure
 */
export const updateUser = async (
  id: string,
  data: UpdateUserData,
): Promise<boolean> => {
  try {
    const validatedData = UpdateUserSchema.parse(data);
    const response = await fetch(`${backendURL}/api/users/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });
    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message);
    }
    toast.success("User updated successfully.");
    return true;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      showErrorToast(
        "Invalid user data: " + error.errors.map((e) => e.message).join(", "),
      );
    } else {
      showErrorToast(error);
    }
    return false;
  }
};

/**
 * Soft deletes a user
 * @param id - The user ID
 * @returns A boolean indicating success or failure
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${backendURL}/api/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message);
    }
    toast.success("User deleted successfully.");
    return true;
  } catch (error: unknown) {
    showErrorToast(error);
    return false;
  }
};

/**
 * Fetches a user by email
 * @param email - The user's email
 * @returns A UserInfoDto or null if an error occurs
 */
export const getUserByEmail = async (
  email: string,
): Promise<UserInfoDto | null> => {
  try {
    const response = await fetch(`${backendURL}/api/users/email/${email}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message);
    }
    return UserInfoDtoSchema.parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};

/**
 * Uploads a profile picture for a user
 * @param id - The user ID
 * @param file - The image file to upload
 * @returns The URL of the uploaded image or null if an error occurs
 */
export const uploadProfilePicture = async (
  id: string,
  file: File,
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${backendURL}/api/users/${id}/profile-picture`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );
    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message);
    }
    toast.success("Profile picture uploaded successfully.");
    return res.imageUrl;
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};

/**
 * Fetches the current user's profile
 * @returns A UserInfoDto of the current user or null if an error occurs
 */
export const getCurrentUserProfile = async (): Promise<UserInfoDto | null> => {
  try {
    const response = await fetch(`${backendURL}/api/users/profile`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message);
    }
    return UserInfoDtoSchema.parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};
