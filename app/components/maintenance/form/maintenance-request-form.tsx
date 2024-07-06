import { HTMLAttributes, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/custom/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import ImageUpload from "@/components/custom/image-upload";

interface ImageFile extends File {
  preview: string;
}

const MaintenanceRequestSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  // images: z.instanceof(File).array().optional(),
});

interface MaintenanceRequestFormProps extends HTMLAttributes<HTMLDivElement> {
  propertyId: string;
}

type MaintenanceRequestFormErrorSchema = {
  data: {
    message: string;
    details?: string;
    timestamp?: string;
  };
  statusCode: number;
  error: string;
  stackTrace?: string;
};

export default function MaintenanceRequestForm({
  propertyId,
  className,
  ...props
}: MaintenanceRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  // const [images, setImages] = useState<ImageFile[]>([]);

  const form = useForm<z.infer<typeof MaintenanceRequestSchema>>({
    resolver: zodResolver(MaintenanceRequestSchema),
    defaultValues: {
      description: "",
      // images: [],
    },
  });

  async function onSubmit(data: z.infer<typeof MaintenanceRequestSchema>) {
    try {
      setIsLoading(true);

      const token = "user_token";
      const res = await fetch(
        `${window.ENV?.BACKEND_URL}/api/maintenance-requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            propertyId,
            ...data,
          }),
          credentials: "include",
        },
      );

      if (!res.ok) {
        const error = (await res.json()) as MaintenanceRequestFormErrorSchema;
        throw new Error(error.data.message);
      } else {
        toast.success("Property listed successfully!");
      }
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        toast.error(error.message);
      }
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            List Your Property
          </CardTitle>
          <CardDescription>
            Enter the details below to advertise your property.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-4">
                Maintenance Request Form
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter maintenance issue description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <Controller
                  name="images"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <ImageUpload images={images} setImages={setImages} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" loading={isLoading}>
                Submit Request
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
