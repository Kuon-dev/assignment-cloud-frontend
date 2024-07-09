import { toast } from "sonner";
import { z } from "zod";

const backendURL =
  typeof window !== "undefined"
    ? window.ENV.BACKEND_URL
    : process.env.BACKEND_URL;

/**
 * Zod schema for listing model
 */
const ListingModelSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  price: z.number(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean(),
  views: z.number(),
  // Add other fields as necessary
});

type ListingModel = z.infer<typeof ListingModelSchema>;

/**
 * Zod schema for pagination parameters
 */
const PaginationParamsSchema = z.object({
  pageNumber: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

type PaginationParams = z.infer<typeof PaginationParamsSchema>;

/**
 * Zod schema for custom  result
 */
const CustomResultSchema = z.object({
  items: z.array(ListingModelSchema),
  totalItems: z.number().int().nonnegative(),
  pageNumber: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
});

type CustomResult<T> = z.infer<typeof CustomPaginatedResultSchema>;

/**
 * Zod schema for creating a listing
 */
const CreateListingDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  // Add other fields as necessary
});

type CreateListingDto = z.infer<typeof CreateListingDtoSchema>;

/**
 * Zod schema for updating a listing
 */
const UpdateListingDtoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  // Add other fields as necessary
});

type UpdateListingDto = z.infer<typeof UpdateListingDtoSchema>;

/**
 * Zod schema for listing search parameters
 */
const ListingSearchParamsSchema = z.object({
  keyword: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  // Add other search parameters as necessary
});

type ListingSearchParams = z.infer<typeof ListingSearchParamsSchema>;

/**
 * Zod schema for rental application model
 */
const RentalApplicationModelSchema = z.object({
  id: z.string().uuid(),
  // Add other fields as necessary
});

type RentalApplicationModel = z.infer<typeof RentalApplicationModelSchema>;

/**
 * Zod schema for performance analytics
 */
const PerformanceAnalyticsSchema = z.object({
  // Define the structure of performance analytics
});

type PerformanceAnalytics = z.infer<typeof PerformanceAnalyticsSchema>;

/**
 * Zod schema for listing analytics
 */
const ListingAnalyticsSchema = z.object({
  // Define the structure of listing analytics
});

type ListingAnalytics = z.infer<typeof ListingAnalyticsSchema>;

/**
 * Shows an error toast with the given error message
 * @param error - The error object or message
 */
const showErrorToast = (error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  toast.error(errorMessage);
};

/**
 * Fetches listings with pagination
 * @param params - Pagination parameters
 * @returns A CustomResult of ListingModel or null if an error occurs
 */
export const getListings = async (
  params: PaginationParams,
): Promise<CustomResult<ListingModel> | null> => {
  try {
    const validatedParams = PaginationParamsSchema.parse(params);
    const queryString = new URLSearchParams(validatedParams as any).toString();
    const response = await fetch(`${backendURL}/api/Listings?${queryString}`, {
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
    return CustomResultSchema.parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};

/**
 * Fetches a specific listing by ID
 * @param id - The listing ID
 * @returns A ListingModel or null if an error occurs
 */
export const getListing = async (id: string): Promise<ListingModel | null> => {
  try {
    const response = await fetch(`${backendURL}/api/Listings/${id}`, {
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
    return ListingModelSchema.parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};

/**
 * Creates a new listing
 * @param listingDto - The listing data to create
 * @returns A ListingModel of the created listing or null if an error occurs
 */
export const createListing = async (
  listingDto: CreateListingDto,
): Promise<ListingModel | null> => {
  try {
    const validatedData = CreateListingDtoSchema.parse(listingDto);
    const response = await fetch(`${backendURL}/api/Listings`, {
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
    toast.success("Listing created successfully.");
    return ListingModelSchema.parse(res);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      showErrorToast(
        "Invalid listing data: " +
          error.errors.map((e) => e.message).join(", "),
      );
    } else {
      showErrorToast(error);
    }
    return null;
  }
};

/**
 * Updates an existing listing
 * @param id - The listing ID
 * @param listingDto - The listing data to update
 * @returns A boolean indicating success or failure
 */
export const updateListing = async (
  id: string,
  listingDto: UpdateListingDto,
): Promise<boolean> => {
  try {
    const validatedData = UpdateListingDtoSchema.parse(listingDto);
    const response = await fetch(`${backendURL}/api/Listings/${id}`, {
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
    toast.success("Listing updated successfully.");
    return true;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      showErrorToast(
        "Invalid listing data: " +
          error.errors.map((e) => e.message).join(", "),
      );
    } else {
      showErrorToast(error);
    }
    return false;
  }
};

/**
 * Deletes a listing
 * @param id - The listing ID
 * @returns A boolean indicating success or failure
 */
export const deleteListing = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${backendURL}/api/Listings/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.message);
    }
    toast.success("Listing deleted successfully.");
    return true;
  } catch (error: unknown) {
    showErrorToast(error);
    return false;
  }
};

/**
 * Searches listings based on given parameters
 * @param searchParams - The search parameters
 * @returns An array of ListingModel or null if an error occurs
 */
export const searchListings = async (
  searchParams: ListingSearchParams,
): Promise<ListingModel[] | null> => {
  try {
    const validatedParams = ListingSearchParamsSchema.parse(searchParams);
    const queryString = new URLSearchParams(validatedParams as any).toString();
    const response = await fetch(
      `${backendURL}/api/Listings/search?${queryString}`,
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
    return z.array(ListingModelSchema).parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};

/**
 * Fetches applications for a specific listing
 * @param id - The listing ID
 * @returns An array of RentalApplicationModel or null if an error occurs
 */
export const getListingApplications = async (
  id: string,
): Promise<RentalApplicationModel[] | null> => {
  try {
    const response = await fetch(
      `${backendURL}/api/Listings/${id}/applications`,
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
    return z.array(RentalApplicationModelSchema).parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};

/**
 * Fetches performance analytics for all listings
 * @returns PerformanceAnalytics or null if an error occurs
 */
export const getListingsPerformance =
  async (): Promise<PerformanceAnalytics | null> => {
    try {
      const response = await fetch(`${backendURL}/api/Listings/performance`, {
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
      return PerformanceAnalyticsSchema.parse(res);
    } catch (error: unknown) {
      showErrorToast(error);
      return null;
    }
  };

/**
 * Fetches analytics for a specific listing
 * @param id - The listing ID
 * @returns ListingAnalytics or null if an error occurs
 */
export const getListingAnalytics = async (
  id: string,
): Promise<ListingAnalytics | null> => {
  try {
    const response = await fetch(`${backendURL}/api/Listings/${id}/analytics`, {
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
    return ListingAnalyticsSchema.parse(res);
  } catch (error: unknown) {
    showErrorToast(error);
    return null;
  }
};
