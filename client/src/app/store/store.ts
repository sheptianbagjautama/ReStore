import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { errorApi } from "../features/about/errorApi";
import { basketApi } from "../features/basket/basketApi";
import { catalogApi } from "../features/catalog/catalogApi";
import { counterSlice } from "../features/contact/counterReducer";
import { uiSlice } from "../layout/uiSlice";
import { catalogSlice } from "../features/catalog/catalogSlice";
import { accountApi } from "../features/account/accountApi";

// //Redux Core yang dulu
// export function configureTheStore(){
//     return legacy_createStore(counterReducer);
// }

//Redux Toolkit yang baru 
export const store = configureStore({
    reducer:{
        [catalogApi.reducerPath]:catalogApi.reducer,
        [errorApi.reducerPath]:errorApi.reducer,
        [basketApi.reducerPath]:basketApi.reducer,
        [accountApi.reducerPath]:accountApi.reducer,
        counter:counterSlice.reducer,
        ui:uiSlice.reducer,
        catalog:catalogSlice.reducer
    },
    //Inisialisasi middleware untuk caching, fetching status
    middleware:(getDefaultMiddleware) => 
        getDefaultMiddleware().concat(
            catalogApi.middleware, 
            errorApi.middleware,
            basketApi.middleware,
            accountApi.middleware,
        )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//Penggunaan useDispatch dan useSelector menggunakan typescript agar type safety
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()



