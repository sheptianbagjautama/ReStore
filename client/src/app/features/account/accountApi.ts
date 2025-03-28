import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../api/baseApi";
import { User } from "../../models/user";
import { LoginSchema } from "../../../lib/schemas/loginSchema";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    login: builder.mutation<void, LoginSchema>({
      query: (creds) => {
        console.log(creds);
        return {
          url: "login?useCookies=true",
          method: "POST",
          body: creds, //request body email dan password
        };
      },
    }),
    register: builder.mutation<void, object>({
      query: (creds) => {
        return {
          url: "account/register",
          method: "POST",
          body: creds,
        };
      },
    }),
    useInfo: builder.query<User, void>({
      query: () => "account/user-info",
    }),
    logout: builder.mutation({
      query: () => ({
        url: "account/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {useLoginMutation, useRegisterMutation, useLogoutMutation} = accountApi;
