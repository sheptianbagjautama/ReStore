import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../api/baseApi";
import { Product } from "../../models/product";
import { ProductParams } from "../../models/productParams";
import { filterEmptyValues } from "../../../lib/util";

export const catalogApi = createApi({
    reducerPath:'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints:(builder) => ({
        fetchProducts:builder.query<Product[], ProductParams>({
            query:(productParams) => {
                return {
                    url:'products',
                    params:filterEmptyValues(productParams)
                }
            }
        }),
        fetchProductDetails:builder.query<Product, number>({
            query:(productId) => `products/${productId}`
        }),
        fetchFilters:builder.query<{brands:string[], types:string[]},void>({
            query: () => 'products/filters'
        })
    })
});

export const {useFetchProductDetailsQuery, useFetchProductsQuery, useFetchFiltersQuery} = catalogApi;