import { Button } from "@/components/ui/button";
import { PaymentElement } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  return (
    <>
      <form>
        <PaymentElement />
        <Button>Submit</Button>
      </form>
    </>
  );
}
