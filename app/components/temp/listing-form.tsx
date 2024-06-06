import { useState, useEffect } from "react";
import { apiClient, getToken, getCookie } from "~/hooks/BackendAPI";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

import type { z } from "zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type ListingFormValues = z.infer<typeof listingSchemaFull>;

import { PhTrashLight } from "~/integrations/react/icons/Phosphor";
import { SvgSpinners180Ring } from "~/integrations/react/icons/Spinner";
import {
  SelectField,
  TextareaField,
  CheckboxField,
  InputField,
} from "./listing-fields";
import { GalleryComponent } from "~/modules/gallery/react/gallery";
import type {
  FetchedImageProps,
  FetchedVideoProps,
} from "~/modules/gallery/models/types";
import { useMediaStore } from "~/modules/gallery/react/gallery-store";
import { fieldsForSale, fieldsForRent } from "../model/constant";
import { listingSchemaFull } from "../model/schema";
import type { FormFieldProps, ListingProps } from "../model/types";

type ListingFormProps = {
  fields: FormFieldProps[]; // Define the FieldType according to your needs
  listing?: ListingProps;
  type: string;
  children?: React.ReactNode;
  handleRefetch: () => void;
  // onSubmit: SubmitHandler<ListingFormValues>;
};

interface AlertComponentProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AlertComponent: React.FC<AlertComponentProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are changing the type of the listing. This is likely an
            unintended action. Do you wish to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function ListingForm({
  handleRefetch,
  children,
  fields,
  listing,
  type,
}: ListingFormProps) {
  const [isEditing, setIsEditing] = useState(!!listing);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [formData, setFormData] = useState<ListingFormValues | null>(null);
  const { toast } = useToast();

  const default_bedrooms = listing?.room_info
    ? parseInt(listing.room_info.split(":")[0])
    : undefined;
  const default_bathrooms = listing?.room_info
    ? parseInt(listing.room_info.split(":")[1])
    : undefined;
  const default_car_park = listing?.room_info
    ? parseInt(listing.room_info.split(":")[2])
    : undefined;

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchemaFull),
    defaultValues: {
      title: listing?.title || "",
      description: listing?.description || "",
      location: listing?.location || "",
      for_sale: listing?.for_sale || false,
      room_info: listing?.room_info || "0:0:0",
      price: listing ? parseInt(listing.price) : 0,
      status: listing?.status || "available",
      property_type: listing?.property_type || "master room",
      square_fit: listing?.square_fit || 0,
      move_in_dates: listing?.move_in_dates || "",
      contract_duration: listing?.contract_duration || "",
      apartment_tags: listing?.apartment_tags || [],
      environment_tags: listing?.environment_tags || [],
      admin_remark: listing?.admin_remark || "",
      draft_status: listing?.draft_status || "drafting",
      bedrooms: default_bedrooms || 0,
      bathrooms: default_bathrooms || 0,
      car_park: default_car_park || 0,
      // images: listing?.images || [],
      // videos: listing?.videos || [],
    },
  });

  const groups = [
    ["title"], // Title of the listing
    ["description"], // Description of the listing
    ["location"], // Location details
    ["forSale"], // Sale status
    ["bedrooms", "bathrooms", "car_park"], // Room information, flexed horizontally
    ["price"], // Price details
    ["status"], // Status of the listing
    ["property_type", "square_fit"], // Type of property
    ["move_in_dates"], // Available move-in dates
    ["contract_duration"], // Duration of the rental contract
    ["apartment_tags", "environment_tags"], // Tags related to the apartment
    ["admin_remark"], // Admin remarks
    ["draft_status"], // Draft status of the listing
    ["media"], // Draft status of the listing
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, addImages, removeImages] = useMediaStore((state) => [
    state.selectedImages,
    state.selectImage,
    state.deselectImage,
  ]);
  const [selectedVideos, addVideos, removeVideos] = useMediaStore((state) => [
    state.selectedVideos,
    state.selectVideo,
    state.deselectVideo,
  ]);

  useEffect(() => {
    if (!listing?.id || selectedImages.length !== 0) return;
    listing.image_paths.forEach((img) => {
      addImages(img);
    });
    if (selectedVideos.length !== 0) return;
    listing.video_paths.forEach((video) => {
      addVideos(video);
    });
  }, []);

  const onSubmit: SubmitHandler<ListingFormValues> = async (data) => {
    if ((type === "sale") !== data.for_sale) {
      setShowAlert(true);
      setFormData(data); // Store the form data temporarily
      return;
    }
    await submitData(data); // Directly submit if no change in 'for_sale'
  };

  const handleAlertConfirm = async () => {
    setShowAlert(false);
    if (formData) {
      await submitData(formData); // Submit the stored form data
    }
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
    // Reset the form to its initial state if needed
    // form.reset();
  };

  const submitData = async (data: ListingFormValues) => {
    setIsLoading(true);
    const roomInfo = `${data.bedrooms}:${data.bathrooms}:${data.car_park}`;
    const submissionData = {
      ...data,
      for_sale: type === "sale",
      room_info: roomInfo, // Add the "room_info" key
      bedrooms: undefined, // These fields will be ignored in the submission
      bathrooms: undefined,
      carPark: undefined,
      user_id: listing ? listing.user_id : 1,
      images: selectedImages,
      videos: selectedVideos,
    };
    // Remove the individual fields for bedroom, bathroom, and car park
    delete submissionData.bedrooms;
    delete submissionData.bathrooms;
    delete submissionData.carPark;

    await getToken();
    const token = await getCookie();
    try {
      let response;
      if (listing && listing.id) {
        // Update existing listing
        response = await apiClient.put(
          `/api/listings/${listing.id}`,
          submissionData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new listing
        response = await apiClient.post("/api/listings", submissionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200)
        toast({
          title: "Success",
          description:
            listing && listing.id
              ? "Successfully updated listing"
              : "Successfully created listing",
        });
      else throw new Error("Unable to process request");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "An error occurred",
        description: "Unable to process your request. Please try again later.",
      });
    } finally {
      setIsLoading(false); // Set loading state to false
      handleRefetch();
    }
  };

  const renderField = (field: FormFieldProps, innerField: any) => {
    switch (field.type) {
      case "select":
        return <SelectField field={field} innerField={innerField} />;
      case "textarea":
        return <TextareaField field={field} innerField={innerField} />;
      case "checkbox":
        return <CheckboxField field={field} form={form} />;
      case "gallery":
        return (
          <GalleryComponent
            images={useMediaStore((state) => state.allImages)}
            videos={useMediaStore((state) => state.allVideos)}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            min={0}
            onChange={(e) => {
              innerField.onChange(Number(e.target.value));
            }}
            value={innerField.value}
          />
        );
      default:
        return <InputField field={field} innerField={innerField} />;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 flex flex-col"
      >
        {groups.map((group, groupIdx) => {
          const validFields = group
            .map((fieldName) => fields.find((f) => f.name === fieldName))
            .filter(Boolean);
          if (validFields.length === 0) return null;

          return (
            <div
              key={groupIdx}
              className="flex space-x-4 w-full justify-between items-stretch"
            >
              {validFields.map(
                (field) =>
                  field && (
                    <FormField
                      key={`grouped-form-${field.label}`}
                      control={form.control}
                      name={field.name as any}
                      render={({ field: innerField }) => (
                        <FormItem
                          className={`${field.className} items-stretch flex flex-col justify-between`}
                          style={{ flexGrow: "1" }}
                        >
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            {renderField(field, innerField)}
                          </FormControl>
                          <FormDescription className="mt-4">
                            {field.description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
              )}
            </div>
          );
        })}
        <div className="flex flex-row overflow-x-scroll snap gap-5">
          {selectedImages.map((img, i) => (
            <div
              key={i}
              className="snap-center h-52 w-52 block flex-shrink-0 relative transition-opacity group"
            >
              <img
                src={img}
                alt=""
                className="block group-hover:opacity-60 transtition-opacity"
                width="768"
                height="768"
              />
              <div className="absolute top-1 right-1 group-hover:scale-125 group-hover:translate-y-1 group-hover:-translate-x-1 transition-transform opacity-100">
                <button onClick={() => removeImages(img)} type="button">
                  <PhTrashLight className="text-2xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {children}
        <button
          type="submit"
          disabled
          className="none"
          aria-hidden="true"
        ></button>
        <Button type="submit" disabled={isLoading} className="flex gap-2">
          {isLoading && <SvgSpinners180Ring />}
          Submit Form
        </Button>
      </form>
      <AlertComponent
        open={showAlert}
        onConfirm={handleAlertConfirm}
        onCancel={handleAlertCancel}
      />
    </Form>
  );
}

interface ListingEditFormProps {
  listing: ListingProps;
  images: FetchedImageProps[];
  videos: FetchedVideoProps[];
  children?: React.ReactNode;
  handleRefetch: () => void;
}
export const ListingEditForm = ({
  children,
  listing,
  images,
  videos,
  handleRefetch,
}: ListingEditFormProps) => {
  const setImages = useMediaStore((state) => state.setImage);
  setImages(images);

  return (
    <Tabs
      defaultValue={listing.for_sale ? "forSale" : "forRent"}
      className="w-full"
    >
      <TabsList>
        <TabsTrigger value="forSale">For Sale</TabsTrigger>
        <TabsTrigger value="forRent">For Rent</TabsTrigger>
      </TabsList>
      <TabsContent value="forSale">
        <ListingForm
          fields={fieldsForSale}
          listing={listing}
          type="sale"
          handleRefetch={handleRefetch}
        >
          {children}
        </ListingForm>
      </TabsContent>
      <TabsContent value="forRent">
        <ListingForm
          fields={fieldsForRent}
          listing={listing}
          type="rent"
          handleRefetch={handleRefetch}
        >
          {children}
        </ListingForm>
      </TabsContent>
    </Tabs>
  );
};

export default ListingEditForm;
