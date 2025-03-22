import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../api/baseApi";
import { Product } from "../../models/product";
import { ProductParams } from "../../models/productParams";
import { filterEmptyValues } from "../../../lib/util";
import { Pagination } from "../../models/pagination";

export const catalogApi = createApi({
    reducerPath:'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints:(builder) => ({
        fetchProducts:builder.query<{items:Product[], pagination:Pagination}, ProductParams>({
            query:(productParams) => {
                return {
                    url:'products',
                    params:filterEmptyValues(productParams)
                }
            },
            //untuk mendapatkan data pagination dari header , jadi data kembalinya items dan pagination
            transformResponse:(items:Product[], meta) => {
                const paginationHeader = meta?.response?.headers.get("Pagination");
                //string | null | undefined , untuk pengecekan kondisi nilai 3 tersebut kita bisa menggunakan langsung paginationHeader ? 
                //atau misalkan if(paginationHeader) {}
                const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
                return {items, pagination}
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