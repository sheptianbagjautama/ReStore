import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../api/baseApi";
import { User } from "../../models/user";
import { LoginSchema } from "../../../lib/schemas/loginSchema";
import { router } from "../../routes/Routes";
import { toast } from "react-toastify";

export const accountApi = createApi({
  reducerPath: "accountApi",
  tagTypes:['UserInfo'],
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    login: builder.mutation<void, LoginSchema>({
      query: (creds) => {
        return {
          url: "login?useCookies=true",
          method: "POST",
          body: creds, //request body email dan password
        };
      },
      async onQueryStarted(_,{dispatch, queryFulfilled}) {
        try {
          await queryFulfilled;
          dispatch(accountApi.util.invalidateTags(['UserInfo']))
        } catch (error) {
          console.log(error)
        }
      }
    }),
    register: builder.mutation<void, object>({
      query: (creds) => {
        return {
          url: "account/register",
          method: "POST",
          body: creds,
        };
      },
      async onQueryStarted(_, {queryFulfilled}) {
        try {
          await queryFulfilled;
          toast.success('Registration successfully - you can now sign in!');
          router.navigate('/login');
        } catch (error) {
          console.log(error)
        }
      }
    }),
    useInfo: builder.query<User, void>({
      query: () => "account/user-info",
      providesTags:["UserInfo"]
    }),
    logout: builder.mutation({
      query: () => ({
        url: "account/logout",
        method: "POST",
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        await queryFulfilled;
        dispatch(accountApi.util.invalidateTags(['UserInfo']));
        router.navigate("/");
      }
    }),
  }),
});

export const {useLoginMutation, useRegisterMutation, useLogoutMutation, useUseInfoQuery} = accountApi;
