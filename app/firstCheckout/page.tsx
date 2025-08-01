"use client"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import BookingPage from './_components/BookingPage';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <BookingPage />
    </Elements>
  );
}
