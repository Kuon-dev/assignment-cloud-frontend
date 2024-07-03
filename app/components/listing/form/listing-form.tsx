"use client";

import { useState, ChangeEvent, DragEvent, HTMLAttributes } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/custom/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImageFile extends File {
  preview: string;
}

interface ListingFormProps extends HTMLAttributes<HTMLDivElement> {}

const listingFormSchema = z.object({
  title: z.string().min(1, { message: "Please enter the title" }),
  description: z.string().min(1, { message: "Please enter the description" }),
  property: z.string().min(1, { message: "Please select a property" }),
  price: z.number().min(1, { message: "Please enter a valid price" }),
  images: z.array(z.any()).optional(),
});

export default function ListingForm({ className, ...props }: ListingFormProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  // const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof listingFormSchema>>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      property: "",
      price: 0,
      images: [],
    },
  });

  const properties = ["Property 1", "Property 2", "Property 3", "Property 4"];

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

  const onSubmit = async (data: z.infer<typeof listingFormSchema>) => {
    console.log(data);

    // try {
    //   setIsLoading(true)
    //   // Assuming you have an API endpoint to handle the listing form submission
    //   const res = await fetch(`${window.ENV?.BACKEND_URL}/api/v1/listings`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   })
    //   if (!res.ok) {
    //     const error = await res.json()
    //     throw new Error(error.message)
    //   }
    //   setIsLoading(false)
    //   toast.success("Property listed successfully!")
    // } catch (error) {
    //   console.log(error)
    //   if (error instanceof Error) {
    //     console.error(error)
    //     toast.error(error.message)
    //   }
    //   setIsLoading(false)
    // }
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
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  name="property"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Property</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="border rounded-md p-2 w-full">
                            <SelectValue placeholder="Select a property" />
                          </SelectTrigger>
                          <SelectContent>
                            {properties.map((prop, index) => (
                              <SelectItem key={index} value={prop}>
                                {prop}
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
                  name="price"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Price"
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
                <Button type="submit" loading={true}>
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
