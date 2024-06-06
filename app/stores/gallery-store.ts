import { create } from "zustand";
import type { FetchedImageProps, FetchedVideoProps } from "../models/types";

type MediaStore = {
  allImages: FetchedImageProps[];
  selectedImages: string[];
  allVideos: FetchedVideoProps[];
  selectedVideos: string[];
  addImage: (image: FetchedImageProps) => void;
  setImage: (image: FetchedImageProps[]) => void;
  removeImage: (image: FetchedImageProps) => void;
  addVideo: (video: FetchedVideoProps) => void;
  removeVideo: (video: FetchedVideoProps) => void;
  selectImage: (imageId: string) => void;
  deselectImage: (imageId: string) => void;
  selectVideo: (videoId: string) => void;
  deselectVideo: (videoId: string) => void;
};

export const useMediaStore = create<MediaStore>((set) => ({
  allImages: [],
  selectedImages: [],
  allVideos: [],
  selectedVideos: [],
  addImage: (image) =>
    set((state) => ({ allImages: [...state.allImages, image] })),
  setImage: (image) => set(() => ({ allImages: image })),

  removeImage: (image) =>
    set((state) => ({
      allImages: state.allImages.filter((img) => img !== image),
    })),
  addVideo: (video) =>
    set((state) => ({ allVideos: [...state.allVideos, video] })),
  removeVideo: (video) =>
    set((state) => ({
      allVideos: state.allVideos.filter((vid) => vid !== video),
    })),

  selectImage: (imageId) =>
    set((state) => ({ selectedImages: [...state.selectedImages, imageId] })),
  deselectImage: (imageId) =>
    set((state) => ({
      selectedImages: state.selectedImages.filter((id) => id !== imageId),
    })),
  selectVideo: (videoId) =>
    set((state) => ({ selectedVideos: [...state.selectedVideos, videoId] })),
  deselectVideo: (videoId) =>
    set((state) => ({
      selectedVideos: state.selectedVideos.filter((id) => id !== videoId),
    })),
}));
