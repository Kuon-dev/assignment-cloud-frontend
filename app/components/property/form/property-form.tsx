"use client";

import { useState, ChangeEvent, DragEvent, HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";

interface ImageFile extends File {
  preview: string;
}

interface PropertyFormProps extends HTMLAttributes<HTMLDivElement> {}

const propertyFormSchema = z.object({
  ownerId: z.string().uuid({ message: "Please enter a valid owner ID" }),
  address: z.string().min(1, { message: "Please enter the address" }),
  city: z.string().min(1, { message: "Please enter the city" }),
  state: z.string().min(1, { message: "Please enter the state" }),
  zipCode: z.string().min(1, { message: "Please enter the zip code" }),
  propertyType: z.enum(["Apartment", "House", "Condo", "Townhouse"], {
    errorMap: () => ({ message: "Please select a property type" }),
  }),
  bedrooms: z
    .number()
    .min(1, { message: "Please enter the number of bedrooms" }),
  bathrooms: z
    .number()
    .min(1, { message: "Please enter the number of bathrooms" }),
  squareFootage: z
    .number()
    .min(1, { message: "Please enter the square footage" }),
  rentAmount: z.number().min(1, { message: "Please enter the rent amount" }),
  description: z.string().min(1, { message: "Please enter a description" }),
  amenities: z.array(z.string()).optional(),
  isAvailable: z.boolean(),
  images: z.array(z.any()).optional(),
});

export default function PropertyForm({
  className,
  ...props
}: PropertyFormProps) {
  const [images, setImages] = useState<ImageFile[]>([]);

  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      ownerId: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      propertyType: undefined,
      bedrooms: 0,
      bathrooms: 0,
      squareFootage: 0,
      rentAmount: 0,
      description: "",
      amenities: [],
      isAvailable: true,
      images: [],
    },
  });

  const propertyTypes = ["Apartment", "House", "Condo", "Townhouse"];

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files) as ImageFile[];
    setImages([...images, ...files]);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as ImageFile[];
    setImages([...images, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: z.infer<typeof propertyFormSchema>) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="max-w-7xl mx-auto p-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                List Your Property
              </CardTitle>
              <CardDescription>
                Enter the details below to advertise your property.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Zip Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Property Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="border rounded-md p-2 w-full">
                            <SelectValue placeholder="Select a property type" />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map((type, index) => (
                              <SelectItem key={index} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Bedrooms"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Bathrooms"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="squareFootage"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Square Footage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Square Footage"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rentAmount"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Rent Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Rent Amount"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div
                  className="border-2 border-dashed border-muted-foreground rounded-md px-4 py-8 flex flex-col items-center justify-center cursor-pointer mt-4"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <UploadIcon className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Drag and drop images here or
                  </span>
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary cursor-pointer"
                  >
                    <span>Upload images</span>
                    <UploadIcon className="w-4 h-4" />
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="overflow-x-auto flex gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="flex-shrink-0 relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        width={200}
                        height={200}
                        className="rounded-md object-cover"
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end w-full">
                <Button type="submit" loading={false}>
                  List Property
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

interface IconProps extends React.SVGProps<SVGSVGElement> {}

function UploadIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function XIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
