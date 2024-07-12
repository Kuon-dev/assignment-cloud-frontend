import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { getAuthTokenFromCookie } from "@/lib/router-guard";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CheckoutFormProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutForm({ open, onClose }: CheckoutFormProps) {
  const cookies = document.cookie;
  const authToken = getAuthTokenFromCookie(cookies);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      const response = await fetch(
        `${window.ENV?.BACKEND_URL}/api/Payment/process-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            paymentIntentId: result.paymentIntent.id,
          }),
        },
      );

      if (response.ok) {
        toast.success("Payment successful!");
        onClose();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <PaymentElement />
          <Button disabled={!stripe}>Checkout</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
