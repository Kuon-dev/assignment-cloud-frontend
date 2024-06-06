import { useState, useRef, useEffect, memo } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { apiClient, getToken, getCookie } from "~/hooks/BackendAPI";
import { toast } from "sonner";
// import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

// import type {
//   FetchedImageProps,
//   FetchedVideoProps,
//   FileDetails,
// } from "../models/types";
import { useMediaStore } from "./gallery-store";
import type { AxiosProgressEvent } from "axios";

export interface FileDetails {
  name: string;
  size: string;
  url: string;
}

export interface FetchedImageProps {
  id: string;
  filename: string;
  cdnUrl: string;
}

export interface FetchedVideoProps {
  id: string;
  filename: string;
  cdnUrl: string;
}

const formatFileSize = (size: number) => {
  if (size > 1048576) return Math.round(size / 1048576) + "mb";
  if (size > 1024) return Math.round(size / 1024) + "kb";
  return size + "b";
};

// Utility function to process files
const processFiles = (fileList: File[]) => {
  return fileList.map((file) => ({
    name: file.name,
    size: formatFileSize(file.size),
    file,
    url: URL.createObjectURL(file),
  }));
};

const MediaUploadModal: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [draggedOver, setDraggedOver] = useState(false);
  const hiddenInput = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFiles = (fileList: FileList) => {
    const newFiles = processFiles(Array.from(fileList));
    setFiles([...files, ...newFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files!);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
    setDraggedOver(false);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDelete = (url: string) => {
    setFiles(files.filter((file) => file.url !== url));
  };

  const handleSubmit = async () => {
    setUploadLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    files.forEach((fileDetails, index) => {
      formData.append(`name[${index}]`, fileDetails.name);
      formData.append(`file[${index}]`, fileDetails.file);
      formData.append(`size[${index}]`, fileDetails.size);
    });

    // Replace with your actual token fetching logic
    await getToken();
    const token = getCookie();

    apiClient
      .post("/api/media/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (!progressEvent.total) return;
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      })
      .then(() => {
        toast({
          title: "Success",
          variant: "default",
          description: "Uploaded image successfully",
        });
      })
      .catch((error: Error | any) => {
        console.error(error);

        const errorCode = error.response?.status;
        let errorMessage = "Please try again."; // Default error message

        if (error.response?.data?.errors) {
          // If errors object is present, extract the messages
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(", "); // Join all error messages with a comma
        } else if (error.response?.data?.message) {
          // If errors object is not present but message is present, use it
          errorMessage = error.response.data.message;
        }

        toast({
          title: `Error. Code: ${errorCode}`,
          description: `An error occurred during upload. ${errorMessage}`,
        });
      })
      .finally(() => {
        setUploadLoading(false);
        setUploadProgress(null);
      });
  };

  return (
    <div className="h-auto w-full max-w-screen-xl sm:px-8 md:px-16 sm:py-8">
      <main className="mx-auto max-w-screen-lg h-full">
        <article
          aria-label="File Upload Modal"
          className="relative h-full flex flex-col rounded-md"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragEnter={handleDragEnter}
        >
          <section className="h-full overflow-auto p-8 w-full flex flex-col">
            <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
              <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                <span>Drag and drop your</span>&nbsp;
                <span>files anywhere or</span>
              </p>
              <input
                id="hidden-input"
                ref={hiddenInput}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                id="button"
                variant="outline"
                onClick={() => hiddenInput.current?.click()}
              >
                Upload a file
              </Button>
            </header>

            {uploadProgress !== null && (
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <span>{uploadProgress}%</span>
              </div>
            )}

            <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-900">
              To Upload
            </h1>

            <ul id="gallery" className="flex flex-1 flex-wrap -m-1">
              {files.length === 0 ? (
                <EmptyListItem />
              ) : (
                files.map((file, index) => (
                  <MemoizedListItem
                    key={index}
                    file={file}
                    handleDelete={handleDelete}
                  />
                ))
              )}
            </ul>
          </section>

          <footer className="flex justify-end px-8 pb-8 pt-4 gap-5">
            <Button id="submit" onClick={handleSubmit}>
              Upload now
            </Button>
            <Button variant="outline" id="cancel" onClick={() => setFiles([])}>
              Cancel
            </Button>
          </footer>
        </article>
      </main>
    </div>
  );
};

const EmptyListItem = () => (
  <li className="h-full w-full text-center flex flex-col items-center justify-center">
    <img
      className="mx-auto w-32"
      src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
      alt="no data"
    />
    <span className="text-small text-gray-500">No files selected</span>
  </li>
);

interface ListItemProps {
  file: FileDetails;
  handleDelete: (url: string) => void;
}

const ListItem: React.FC<ListItemProps> = ({ file, handleDelete }) => {
  return (
    <li className="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24 group">
      <article
        tabIndex={0}
        className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline relative bg-gray-100 cursor-pointer relative shadow-sm"
      >
        <img
          alt="upload preview"
          className="img-preview w-full h-full sticky object-cover rounded-md bg-fixed flex group-hover:opacity-25"
          src={file.url}
          width={118}
          height={72}
        />
        <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
          <h1 className="flex-1 group-hover:text-blue-800">{file.name}</h1>
          <div className="flex">
            <span className="p-1 text-blue-800">
              <i>{/* Your existing SVG icon here */}</i>
            </span>
            <p className="p-1 size text-xs text-gray-700">{file.size}</p>
            <button
              className="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800"
              onClick={() => handleDelete(file.url)}
            >
              <svg
                className="pointer-events-none fill-current w-4 h-4 ml-auto"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  className="pointer-events-none"
                  d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                />
              </svg>
            </button>
          </div>
        </section>
      </article>
    </li>
  );
};

const MemoizedListItem = React.memo(ListItem);

interface ImageComponentProps {
  images: FetchedImageProps[];
}

interface MemoizedImageCardProps {
  imageDetails: FetchedImageProps;
  handleImageAddition: (url: string) => void;
  handleImageRemoval: (url: string) => void;
  selectedImageUrls: string[];
}
const MemoizedImageCard = memo(
  ({
    imageDetails,
    handleImageAddition,
    handleImageRemoval,
    selectedImageUrls,
  }: MemoizedImageCardProps) => (
    <div className="w-52 xl:w-80 items-self-center justify-self-center">
      <div className="flex flex-col mt-5">
        <div className="overflow-hidden rounded-lg">
          <Dialog>
            <DialogTrigger>
              <img
                src={imageDetails.cdnUrl}
                alt={imageDetails.filename}
                loading="lazy"
                width={250}
                height={250}
                className="h-auto w-auto max-w-full rounded-lg object-cover transition-all hover:scale-105 aspect-square"
              />
            </DialogTrigger>
            <DialogContent>
              <img
                src={imageDetails.cdnUrl}
                alt={imageDetails.filename}
                loading="lazy"
                width={400}
                height={400}
                className="h-auto w-auto max-w-full rounded-lg object-cover transition-all aspect-none"
              />
            </DialogContent>
          </Dialog>
        </div>
        <p className="mt-2">{imageDetails.filename}</p>
      </div>
      <Separator className="my-2" />
      <div className="flex h-5 items-center space-x-4 text-sm justify-between">
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          onClick={() => handleImageAddition(imageDetails.cdnUrl)}
          disabled={selectedImageUrls.includes(imageDetails.cdnUrl)}
        >
          Select
        </Button>
        <Separator orientation="vertical" />
        <Button
          variant="ghost"
          className="hover:bg-transparent"
          disabled={!selectedImageUrls.includes(imageDetails.cdnUrl)}
          onClick={() => handleImageRemoval(imageDetails.cdnUrl)}
        >
          Deselect
        </Button>
        <Separator orientation="vertical" />
        <Button variant="ghost" className="hover:bg-transparent">
          Delete
        </Button>
      </div>
    </div>
  )
);

const ImageComponent = ({ images }: ImageComponentProps) => {
  const [selectedImages, addImages, removeImages] = useMediaStore((state) => [
    state.selectedImages,
    state.selectImage,
    state.deselectImage,
  ]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images && images.length > 0 ? (
        images.map((imageDetails, index) => (
          <MemoizedImageCard
            key={index}
            imageDetails={imageDetails}
            handleImageAddition={addImages}
            handleImageRemoval={removeImages}
            selectedImageUrls={selectedImages}
          />
        ))
      ) : (
        <div className="col-span-full text-center text-lg">
          No images selected, upload image now
        </div>
      )}
    </div>
  );
};

interface GalleryComponentProps {
  images: FetchedImageProps[];
  videos: any[];
}

export const GalleryComponent = ({ images, videos }: GalleryComponentProps) => {
  const [currentTab, setCurrentTab] = useState("image");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Gallery</Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl flex flex-col items-center justify-center h-[90vh]">
        <Tabs
          defaultValue={currentTab}
          className="w-full h-full overflow-y-scroll relative"
          onValueChange={(e) => setCurrentTab(e)}
        >
          <TabsList className="sticky">
            <TabsTrigger value="upload">Uploads</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="overflow-y- h-full my-4">
            {currentTab && <MediaUploadModal />}
          </TabsContent>
          <TabsContent value="image" className="overflow-y- h-full my-4">
            {currentTab && <ImageComponent images={images} />}
          </TabsContent>
          <TabsContent value="video"></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
