import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function PaymentForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        alert("Payment Successful");
      }
    }
  };

  return (
    <div>
      <CardElement />
      <button onClick={handlePay}>Pay Now</button>
    </div>
  );
}