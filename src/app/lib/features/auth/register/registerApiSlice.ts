import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../axiosBaseQuery";
import type { IRegisterRequestBody,IRegisterUserResponse } from "./types";

export const registerApiSlice = createApi({
    baseQuery : axiosBaseQuery(),
    reducerPath : 'regisApi',
    tagTypes : [],
    endpoints : build => ({
        register : build.mutation<IRegisterUserResponse,IRegisterRequestBody>({
            query:body => ({
                url : 'api/register',
                method : 'post',
                data: body
            })
        })
    })
})

export const {useRegisterMutation} = registerApiSlice;