import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import { IPropertiesPayload, IProperty } from "./types";

export const propertiesApiSlice = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'propertiesApi',
  tagTypes: [], // You can define tags for caching if needed
  endpoints: (build) => ({
    getProperty: build.query<IProperty[], void>({
      query: () => ({
        url: 'api/properties', // Adjust the URL based on your backend API endpoint
        method: 'GET',
      }),
    }),
    addProperty: build.mutation<IProperty, IPropertiesPayload>({
      query: (payload) => ({
        url: 'api/properties',
        method: 'POST',
        body: payload, // Correctly specify the body
        headers: {
          'Content-Type': 'application/json', // Explicitly set the content type
        },
      }),
    }),
  }),
});

export const { useGetPropertyQuery, useAddPropertyMutation } = propertiesApiSlice;
