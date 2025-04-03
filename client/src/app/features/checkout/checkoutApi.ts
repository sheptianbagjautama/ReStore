
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../api/baseApi";
import { Basket } from "../../models/basket";
import { basketApi } from "../basket/basketApi";

export const checkoutApi = createApi({
  reducerPath: "checkoutApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<Basket, void>({
      query: () => {
        return {
          url: "payments",
          method: "POST",
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          //untuk get data basket terbaru dengan menambahkan client secret stripe
          dispatch(
            basketApi.util.updateQueryData(
              "fetchBasket",
              undefined,
              (draft) => {
                draft.clientSecret = data.clientSecret;
              }
            )
          );
        } catch (error) {
          console.log("Payment intent creation failed: ", error);
        }
      },
    }),
  }),
});


export const {useCreatePaymentIntentMutation}  = checkoutApi;
