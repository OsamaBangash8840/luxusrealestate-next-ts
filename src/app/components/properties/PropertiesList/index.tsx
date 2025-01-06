'use client'
import { useGetPropertyQuery } from "@/app/lib/features/properties/propertiesApiSlice";
import { IProperty } from "@/app/lib/features/properties/types";
import React from "react";


export const PropertiesList = ():React.ReactElement => {
    const { data, error, isLoading } = useGetPropertyQuery();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
         {data?.map((property:IProperty) => (
        <>
        <div key={property._id}>{property.title}</div>
        <div>{property.description}</div>
        </>
      ))}
        </>
    )
}