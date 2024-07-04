import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
// import { FileInput } from "@/components/ui/file-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RentalApplicationSchema = z.object({
  personalInfo: z
    .string()
    .min(1, { message: "Personal information is required" }),
  employmentDetails: z
    .string()
    .min(1, { message: "Employment details are required" }),
  references: z.string().min(1, { message: "References are required" }),
  proofOfIncome: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Proof of income is required" })
    .optional(),
  identification: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Identification is required" })
    .optional(),
  rentalHistory: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Rental history is required" })
    .optional(),
});

export type RentalApplicationFormValues = z.infer<
  typeof RentalApplicationSchema
>;

interface RentalApplicationFormProps {
  onSubmit: (data: RentalApplicationFormValues) => void;
}

export const RentalApplicationForm: React.FC<RentalApplicationFormProps> = ({
  onSubmit,
}) => {
  const form = useForm<RentalApplicationFormValues>({
    resolver: zodResolver(RentalApplicationSchema),
    defaultValues: {
      personalInfo: "",
      employmentDetails: "",
      references: "",
      proofOfIncome: undefined,
      identification: undefined,
      rentalHistory: undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Rental Application Form</h2>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="personalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Information</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter personal information"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employmentDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Details</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter employment details" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="references"
            render={({ field }) => (
              <FormItem>
                <FormLabel>References</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter references" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="proofOfIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proof of Income</FormLabel>
                <FormControl>
                  {/* <FileInput {...field} /> */}
                  <Textarea placeholder="Enter references" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identification</FormLabel>
                <FormControl>
                  {/* <FileInput {...field} /> */}
                  <Textarea placeholder="Enter references" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rentalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rental History</FormLabel>
                <FormControl>
                  {/* <FileInput {...field} /> */}
                  <Textarea placeholder="Enter references" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="mt-4">
          Submit Application
        </Button>
      </form>
    </Form>
  );
};
