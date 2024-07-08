import { toast } from "sonner";
import { z } from "zod";

const backendURL =
  typeof window !== "undefined"
    ? window.ENV.BACKEND_URL
    : process.env.BACKEND_URL;

/**
 * Zod schema for media DTO
 */
const MediaDtoSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string(),
  filePath: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  uploadedAt: z.string().datetime(),
});

/**
 * Type for media DTO
 */
type MediaDto = z.infer<typeof MediaDtoSchema>;

/**
 * Zod schema for creating media
 */
const CreateMediaSchema = z.object({
  file: z.instanceof(File),
  customFileName: z.string().optional(),
});

/**
 * Type for creating media
 */
type CreateMediaData = z.infer<typeof CreateMediaSchema>;

/**
 * Shows an error toast with the given error message
 * @param error - The error object or message
 */
const showErrorToast = (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  toast.error(errorMessage);
};

/**
 * Creates a new media entry
 * @param data - The media data to create
 * @returns A MediaDto of the created media or null if an error occurs
 */
export const createMedia = async (
  data: CreateMediaData,
): Promise<MediaDto | null> => {
  try {
    const validatedData = CreateMediaSchema.parse(data);
    const formData = new FormData();
    formData.append("file", validatedData.file);
    if (validatedData.customFileName) {
      formData.append("customFileName", validatedData.customFileName);
    }

    const response = await fetch(`${backendURL}/api/Media`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const res = await response.json();
    if (!response.ok) {
      throw new Error(res.message);
    }
    const createdMedia = MediaDtoSchema.parse(res);
    toast.success("Media created successfully.");
    return createdMedia;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      showErrorToast(
        "Invalid media data: " + error.errors.map((e) => e.message).join(", "),
      );
    } else {
      showErrorToast(error);
    }
    return null;
  }
};

/**
 * Retrieves a media entry by its ID
 * @param id - The ID of the media to retrieve
 * @returns A MediaDto or null if an error occurs
 */
export const getMediaById = async (id: string): Promise<MediaDto | null> => {
  try {
    const response = await fetch(`${backendURL}/api/Media/${id}`, {
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
    return MediaDtoSchema.parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};

/**
 * Retrieves all media entries for the current user
 * @returns An array of MediaDto or null if an error occurs
 */
export const getAllMedia = async (): Promise<MediaDto[] | null> => {
  try {
    const response = await fetch(`${backendURL}/api/Media`, {
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
    return MediaDtoSchema.array().parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};

/**
 * Deletes a media entry
 * @param id - The ID of the media to delete
 * @returns A boolean indicating success or failure
 */
export const deleteMedia = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${backendURL}/api/Media/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message);
    }
    toast.success("Media deleted successfully.");
    return true;
  } catch (error: unknown) {
    showErrorToast(error);
    return false;
  }
};
