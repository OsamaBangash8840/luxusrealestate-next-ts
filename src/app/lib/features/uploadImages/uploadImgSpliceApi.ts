import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

interface UploadedImage {
    imageUrl: string;
  }
export const uploadImgSpliceApi = createApi({
    reducerPath: 'uploadImgSpliceApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: [],
    endpoints: (build) => ({
        uploadImages: build.mutation<UploadedImage[], FormData>({
            query: (formData) => {
                const headers: Record<string, string> = {};
                if (formData instanceof FormData) {
                    delete headers['Content-Type']; // Let axios set the content type
                }
                return {
                    url: `api/upload`,
                    method: 'POST',
                    body: formData,
                    headers,
                };
            },
        })
    })
})

export const { useUploadImagesMutation } = uploadImgSpliceApi;