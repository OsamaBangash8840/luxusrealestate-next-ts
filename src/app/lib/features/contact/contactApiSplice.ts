import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";


 export const contactApiSplice = createApi({
    reducerPath: 'contactApiSplice',
    baseQuery: axiosBaseQuery(),
    tagTypes: [],
    endpoints: (build) => ({
        contact: build.mutation({
            query: (data) => {
                return {
                    url: `api/submit`,
                    method: 'POST',
                    data,
                };
            },
    }),
    newsletter: build.mutation({
        query: (data) => {
            return {
                url: `api/newsletter`,
                method: 'POST',
                data,
            };
        },
    })
})
})
    
export const { useContactMutation, useNewsletterMutation } = contactApiSplice;