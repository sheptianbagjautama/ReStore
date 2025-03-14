import { configureStore, legacy_createStore } from "@reduxjs/toolkit";
import counterReducer, { counterSlice } from "../features/contact/counterReducer";
import { useDispatch, useSelector } from "react-redux";
import { catalogApi } from "../features/catalog/catalogApi";

//Redux Core yang dulu
export function configureTheStore(){
    return legacy_createStore(counterReducer);
}

//Redux Toolkit yang baru 
export const store = configureStore({
    reducer:{
        [catalogApi.reducerPath]:catalogApi.reducer,
        counter:counterSlice.reducer
    },
    //Inisialisasi middleware untuk caching, fetching status
    middleware:(getDefaultMiddleware) => 
        getDefaultMiddleware().concat(catalogApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//Penggunaan useDispatch dan useSelector menggunakan typescript agar type safety
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()



