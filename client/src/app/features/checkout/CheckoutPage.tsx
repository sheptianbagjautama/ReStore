import { Grid2, Typography } from "@mui/material";
import OrderSummary from "../../shared/components/OrderSummary";
import CheckoutStepper from "./CheckoutStepper";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useEffect, useMemo, useRef } from "react";
import { useFetchBasketQuery } from "../basket/basketApi";
import { Elements } from "@stripe/react-stripe-js";
import { useCreatePaymentIntentMutation } from "./checkoutApi";
import { useAppSelector } from "../../store/store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function CheckoutPage() {
  const { data: basket } = useFetchBasketQuery();
  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();

  /**
   * Digunakan untuk keperluan di development agar tidak load 2 kali ketika create payment intent stripe
   * karena di development react menggunakan strict yang dimana strict ini memproses seperti useEffect load 2 kali
   */
  const created = useRef(false);
  const { darkMode } = useAppSelector((state) => state.ui);

  useEffect(() => {
    //hanya di gunakan di development , di production code ini tidak digunakan
    if (!created.current) createPaymentIntent(); //jika false maka akan update basket ke stripe
    created.current = true; //jika true makan tidak akan update basket ke stripe
  }, [createPaymentIntent]);

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!basket?.clientSecret) return undefined;

    return {
      clientSecret: basket.clientSecret,
      //mengatur input ketika dark mode
      appearance: {
        labels: "floating",
        theme: darkMode ? "night" : "stripe",
      },
    };
  }, [basket?.clientSecret, darkMode]);

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={8}>
        {!stripePromise || !options || isLoading ? (
          <Typography variant="h6">Loading checkout...</Typography>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutStepper />
          </Elements>
        )}
      </Grid2>
      <Grid2 size={4}>
        <OrderSummary />
      </Grid2>
    </Grid2>
  );
}
