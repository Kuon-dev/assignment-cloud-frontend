import { apiClient, handleError } from "~/hooks/BackendAPI";
import type { Review } from "../model/types";
import type { ListingProps } from "~/modules/listing/model/types";

export async function getPaginatedListings(
  page: number = 1
): Promise<ListingProps[] | null> {
  try {
    const response = await apiClient.get(`/api/listings?page=${page}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getFavouritedListings(
  ids: string[]
): Promise<ListingProps[] | null> {
  try {
    const response = await apiClient.post(`/api/recents/listings`, {
      ids,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getAllListings(): Promise<ListingProps[] | null> {
  try {
    const response = await apiClient.get("/api/listings-all");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getListingById(id: string): Promise<ListingProps | null> {
  try {
    const response = await apiClient.get(`/api/listings/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getListingWithReviewsAndImages(
  id: number
): Promise<{ listing: ListingProps; reviews: Review[] } | null> {
  try {
    const response = await apiClient.get(`/api/listings/${id}/reviews`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function createListing(
  listing: ListingProps
): Promise<ListingProps | null> {
  try {
    const response = await apiClient.post("/api/listings", listing);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateListing(
  id: number,
  updatedListing: ListingProps
): Promise<ListingProps | null> {
  try {
    const response = await apiClient.put(`/api/listings/${id}`, updatedListing);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteListing(id: number): Promise<null> {
  try {
    await apiClient.delete(`/api/listings/${id}`);
    return null;
  } catch (error) {
    return handleError(error);
  }
}
