import { useFetchBasketQuery } from "../../app/features/basket/basketApi";
import { Item } from "../../app/models/basket";

export const useBakset = () => {
  const { data: basket } = useFetchBasketQuery();

  const subtotal =
    basket?.items.reduce(
      (sum: number, item: Item) => sum + item.quantity * item.price,
      0
    ) ?? 0;
  const deliveryFee = subtotal > 10000 ? 0 : 500; 
  const total = subtotal + deliveryFee;

  return {basket, subtotal, deliveryFee, total};
};
