import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import Review from "./Review";
import { useFetchAddressQuery, useUpdateUserAddressMutation } from "../account/accountApi";
import { Address } from "../../models/user";
import { ConfirmationToken, StripeAddressElementChangeEvent, StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { useBakset } from "../../../lib/hooks/useBasket";
import { currencyFormat } from "../../../lib/util";
import { toast } from "react-toastify";

const steps = ["Address", "Payment", "Review"];

export default function CheckoutStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const { data: { name, ...restAddress } = {} as Address, isLoading } = useFetchAddressQuery();
  const [updateAddress] = useUpdateUserAddressMutation();
  const [saveAddressChecked, setSaveAddressChecked] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const [addressComplete, setAddressComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const {total} = useBakset();
  const [confirmationToken, setConfirmationToken] = useState<ConfirmationToken | null>(null)

  const handleNext = async () => {
    if(activeStep === 0 && saveAddressChecked && elements) {
      const address = await getStripeAddress();
      if(address) await updateAddress(address);
    } 

    //Jika ada di step 1 dan elemen serta stripe ada, maka kita akan mengirimkan elemen ke stripe untuk mendapatkan token konfirmasi.
    if(activeStep === 1) {
      if(!elements || !stripe) return;
      const result = await elements.submit();
      if(result.error) return toast.error(result.error.message);

      const stripeResult = await stripe.createConfirmationToken({elements});
      if(stripeResult.error) return toast.error(stripeResult.error.message);
      setConfirmationToken(stripeResult.confirmationToken);
    }
    setActiveStep((step) => step + 1);
  };

  const getStripeAddress = async () => {
    // Mengambil elemen 'address' dari objek 'elements', yang kemungkinan merupakan bagian dari library Stripe.
    const addressElement = elements?.getElement('address');

    // Jika elemen 'address' tidak ditemukan, fungsi akan langsung mengembalikan null.
    if (!addressElement) return null;

    // Mengambil nilai 'name' dan 'address' dari 'addressElement'.
    const { value: { name, address } } = await addressElement.getValue();

    // Jika 'name' dan 'address' ada (tidak undefined atau null), mengembalikan objek yang berisi properti 'name' dan 'address'.
    // Ini akan berguna untuk mendapatkan informasi alamat lengkap untuk diproses lebih lanjut.
    if (name && address) return { ...address, name };

    // Jika tidak ada 'name' atau 'address', fungsi mengembalikan null.
    return null;
}

  const handleBack = () => {
    setActiveStep((step) => step - 1);
  };

  const handleAddressChange = (event:StripeAddressElementChangeEvent) => {
    setAddressComplete(event.complete);
  }

  
  const handlePaymentChange = (event:StripePaymentElementChangeEvent) => {
    setPaymentComplete(event.complete);
  }


  if(isLoading) return <Typography variant="h6">Loading checkout... </Typography>

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: activeStep === 0 ? "block" : "none" }}>
          <AddressElement
            options={{
              mode: "shipping",
              defaultValues: {
                name: name,
                address: restAddress,
              },
            }}
            onChange={handleAddressChange}
          />
          <FormControlLabel
            sx={{ display: "flex", justifyContent: "end" }}
            control={<Checkbox 
            checked={saveAddressChecked}
            onChange={e => setSaveAddressChecked(e.target.checked)}/>}
            label="Save as default address"
          />
        </Box>
        <Box sx={{ display: activeStep === 1 ? "block" : "none" }}>
          <PaymentElement onChange={handlePaymentChange} />
        </Box>
        <Box sx={{ display: activeStep === 2 ? "block" : "none" }}>
          <Review confirmationToken={confirmationToken} />
        </Box>
      </Box>

      <Box display="flex" paddingTop={2} justifyContent="space-between">
        <Button onClick={handleBack}>Back</Button>
        <Button onClick={handleNext} disabled={
          (activeStep === 0 && !addressComplete) ||
          (activeStep === 1 && !paymentComplete)
        }>{activeStep === steps.length - 1 ? `Pay ${currencyFormat(total)}` : 'Next'} </Button>
      </Box>
    </Paper>
  );
}
