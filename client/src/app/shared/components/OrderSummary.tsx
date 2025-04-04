import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useBakset } from "../../../lib/hooks/useBasket";
import { currencyFormat } from "../../../lib/util";

export default function OrderSummary() {
  const {subtotal, deliveryFee} = useBakset();
  const location = useLocation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth="lg"
      mx="auto"
    >
      <Paper sx={{ mb: 2, p: 3, width: "100%", borderRadius: 3 }}>
        <Typography variant="h6" component="p" fontWeight="bold">
          Order summary
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          Orders over $100 qualify for free delivery!
        </Typography>
        <Box mt={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Subtotal</Typography>
            <Typography>{currencyFormat(subtotal)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Discount</Typography>
            <Typography color="success">
              {/* TODO */}
              -$0.00
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Delivery fee</Typography>
            <Typography>{currencyFormat(deliveryFee)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="textSecondary">Total</Typography>
            <Typography>{currencyFormat(subtotal + deliveryFee)}</Typography>
          </Box>
        </Box>

        <Box mt={2}>
          {!location.pathname.includes("checkout") && (
            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 1 }}
            >
              Checkout
            </Button>
          )}
          <Button component={Link} to="/catalog" fullWidth>
            Continue Shopping
          </Button>
        </Box>
      </Paper>

      {/* Coupon Code Section */}
      <Paper sx={{ width: "100%", borderRadius: 3, p: 3 }}>
        <form>
          <Typography variant="subtitle1" component="label">
            Do you have a voucher code?
          </Typography>

          <TextField
            label="Voucher code"
            variant="outlined"
            fullWidth
            sx={{ my: 2 }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Apply code
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
