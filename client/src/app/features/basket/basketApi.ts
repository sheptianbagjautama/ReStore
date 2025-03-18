import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../api/baseApi";
import { Basket } from "../../models/basket";

export const basketApi = createApi({
  reducerPath: "basketApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes:['Basket'],
  endpoints: (builder) => ({
    fetchBasket: builder.query<Basket, void>({
      query: () => "basket",
      providesTags:['Basket']
    }),
    addBasketItem: builder.mutation<Basket,{ productId: number; quantity: number}>({
      query: ({ productId, quantity }) => ({
        url: `basket?productId=${productId}&quantity=${quantity}`,
        method: "POST",
      }),
      onQueryStarted:async (_, {dispatch, queryFulfilled}) => {
        try {
          await queryFulfilled;
          dispatch(basketApi.util.invalidateTags(['Basket']));
        } catch (error) {
          console.log(error);
        }
      }
    }),
    removeBasketItem: builder.mutation<Basket,{ productId: number; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `basket?productId=${productId}&quantity=${quantity}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {useFetchBasketQuery, useAddBasketItemMutation} = basketApi;
