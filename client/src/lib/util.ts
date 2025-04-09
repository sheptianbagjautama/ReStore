import { PaymentSummary, ShippingAddress } from "../app/models/order";

export function currencyFormat(amount: number) {
  return "$" + (amount / 100).toFixed(2);
}

/** Untuk menghapus filter params yang kosong
 * Contoh url?pageNumber=1&brands=&types
 * Menjadi url?pageNumber=1
 **/
export function filterEmptyValues(values: object) {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) =>
        value != "" &&
        value !== null &&
        value !== undefined &&
        value.length !== 0
    )
  );
}

export function formatAddressString(address:ShippingAddress) {
  return `${address?.name}, ${address?.line1}, ${address?.city}, ${address?.state}, ${address?.postal_code}, ${address?.country}`;
}

export function formatPaymentString(card:PaymentSummary) {
  return `${card?.brand.toUpperCase()}, **** **** **** ${card?.last4}, Exp: ${
    card?.exp_month
  }/${card?.exp_year}`;
}
