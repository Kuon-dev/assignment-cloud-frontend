import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// import { FileInput } from "@/components/ui/file-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MaintenanceRequestSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  photos: z.instanceof(File).array().optional(),
});

export type MaintenanceRequestFormValues = z.infer<
  typeof MaintenanceRequestSchema
>;

interface MaintenanceRequestFormProps {
  onSubmit: (data: MaintenanceRequestFormValues) => void;
}

export const MaintenanceRequestForm: React.FC<MaintenanceRequestFormProps> = ({
  onSubmit,
}) => {
  const form = useForm<MaintenanceRequestFormValues>({
    resolver: zodResolver(MaintenanceRequestSchema),
    defaultValues: {
      description: "",
      photos: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <FormField
            control={form.control}
            name="photos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photos</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter maintenance issue description"
                    {...field}
                  />
                  {/* <FileInput multiple {...field} /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="mt-4">
          Submit Request
        </Button>
      </form>
    </Form>
  );
};
