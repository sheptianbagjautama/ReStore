import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../api/baseApi";
import { Product } from "../../models/product";

export const catalogApi = createApi({
    reducerPath:'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints:(builder) => ({
        fetchProducts:builder.query<Product[], void>({
            query:() => ({url:'products'})
        }),
        fetchProductDetails:builder.query<Product, number>({
            query:(productId) => `products/${productId}`
        })
    })
});

export const {useFetchProductDetailsQuery, useFetchProductsQuery} = catalogApi;