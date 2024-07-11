import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";

import CheckoutForm from "@/components/payment/form/checkout-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthTokenFromCookie } from "@/lib/router-guard";

const PaymentFormSchema = z.object({
  amount: z
    .number()
    .min(1, { message: "Please enter a valid amount" })
    .positive({ message: "Amount must be greater than zero" }),
});

type PaymentFormInputs = z.infer<typeof PaymentFormSchema>;

interface PaymentFormProps {
  lease: Lease;
}

export default function PaymentForm({ lease }: PaymentFormProps) {
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);

  useEffect(() => {
    const fetchStripe = async () => {
      const stripeInstance = await loadStripe(window.ENV.STRIPE_PUBLIC_KEY);
      setStripe(stripeInstance);
    };
    fetchStripe();
  }, [window.ENV.STRIPE_PUBLIC_KEY]);

  const form = useForm<PaymentFormInputs>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      amount: lease.rentAmount,
    },
  });

  const onSubmit = async (data: PaymentFormInputs) => {
    try {
      const response = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Payment/create-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ amount: lease.rentAmount }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const result = await response.json();
      setClientSecret(result.clientSecret);
      setIsCheckoutFormOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!stripe) {
    return <LoadingComponent />;
  }

  return (
    <>
      <div>
        <h3 className="text-lg font-medium mb-2">Lease Details</h3>
        <div className="p-4 border rounded-md flex flex-col gap-2">
          <p>
            <strong>Address:</strong> {lease.property.address}
          </p>
          <p>
            <strong>City:</strong> {lease.property.city}
          </p>
          <p>
            <strong>State:</strong> {lease.property.state}
          </p>
          <p>
            <strong>Zip Code:</strong> {lease.property.zipCode}
          </p>
          <p>
            <strong>Bedrooms:</strong> {lease.property.bedrooms}
          </p>
          <p>
            <strong>Bathrooms:</strong> {lease.property.bathrooms}
          </p>
          <p>
            <strong>Amenities:</strong>{" "}
            {Array.isArray(lease.property.amenities)
              ? lease.property.amenities.join(", ")
              : lease.property.amenities}
          </p>
          <p>
            <strong>Lease Start Date:</strong>{" "}
            {new Date(lease.startDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p>
            <strong>Lease End Date:</strong>{" "}
            {new Date(lease.endDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Pay Now</Button>
          </div>
        </form>
      </Form>
      {clientSecret && (
        <Elements stripe={stripe} options={{ clientSecret }}>
          <CheckoutForm
            open={isCheckoutFormOpen}
            onClose={() => setIsCheckoutFormOpen(false)}
          />
        </Elements>
      )}
    </>
  );
}

function LoadingComponent() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-gray-500 dark:text-gray-400">
          Please wait while we are preparing the content
        </p>
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
