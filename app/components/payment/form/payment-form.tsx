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

const PaymentFormSchema = z.object({
  amount: z
    .number()
    .min(1, { message: "Please enter a valid amount" })
    .positive({ message: "Amount must be greater than zero" }),
});

type PaymentFormInputs = z.infer<typeof PaymentFormSchema>;

export default function PaymentForm() {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

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
      amount: 0,
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
          },
          body: JSON.stringify({ amount: data.amount }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const result = await response.json();
      console.log("Result:", result);

      setClientSecret(result.clientSecret);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!stripe) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {clientSecret && (
        <Elements stripe={stripe} options={{ clientSecret }}>
          <CheckoutForm />
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
