import { Grid2, Typography } from "@mui/material";
import OrderSummary from "../../shared/components/OrderSummary";
import CheckoutStepper from "./CheckoutStepper";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useMemo } from "react";
import { useFetchBasketQuery } from "../basket/basketApi";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function CheckoutPage() {
  const { data: basket } = useFetchBasketQuery();

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!basket?.clientSecret) return undefined;

    return {
      clientSecret: basket.clientSecret,
    };
  }, [basket?.clientSecret]);

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={8}>
        {!stripePromise || !options ? (
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
