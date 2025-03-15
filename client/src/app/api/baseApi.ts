import { BaseQueryApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { startLoading, stopLoading } from "../layout/uiSlice";
import { toast } from "react-toastify";

const customBaseQuery = fetchBaseQuery({
    baseUrl:'https://localhost:5001/api'
});

type ErrorResponse = | string | {title:string} | {errors:string[]}

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async(args:string | FetchArgs, api:BaseQueryApi, extraOptions:object) => {
    api.dispatch(startLoading());
    await sleep();
    const result = await customBaseQuery(args, api, extraOptions);
    api.dispatch(stopLoading());
    if(result.error) { 
        console.log('result.error => ', result.error);  

        const originalStatus = result.error.status === 'PARSING_ERROR' && result.error.originalStatus ? 
        result.error.originalStatus : result.error.status;

        const responseData = result.error.data as ErrorResponse;

        switch(originalStatus){
            case 400:
                //jika responseData string
                if(typeof responseData === 'string') toast.error(responseData);
                //jika didalam responseData ada key errors
                else if('errors' in responseData) {
                    throw Object.values(responseData.errors).flat().join(', ');
                }
                else toast.error(responseData.title);
                break;
            case 401:
                //jika responseData object dan didalamnya ada key title
                if(typeof responseData === 'object' && 'title' in responseData)
                    toast.error(responseData.title);
                break;
            case 404:
                //jika responseData object dan didalamnya ada key title
                if(typeof responseData === 'object' && 'title' in responseData)
                    toast.error(responseData.title);
                break;
            case 500:
                //jika responseData object dan didalamnya ada key title
                if(typeof responseData === 'object' && 'title' in responseData)
                    toast.error(responseData.title);
                break;
            default:
                break;
        }
    }

    return result;
}