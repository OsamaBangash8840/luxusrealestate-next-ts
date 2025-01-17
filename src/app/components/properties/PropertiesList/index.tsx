'use client'
import { useGetPropertyQuery } from "@/app/lib/features/properties/propertiesApiSlice";
import { IProperty } from "@/app/lib/features/properties/types";
import React from "react";
import { Cards } from "../../common/Card";
import { MImage, Typography } from "../../common";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaBath } from "react-icons/fa";
import SearchBar from "../../common/SearchBar";


export const PropertiesList = (): React.ReactElement => {
  const { data, error, isLoading } = useGetPropertyQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  function generateBedroomsAndBathrooms() {
    const bedrooms = Math.floor(Math.random() * 4) + 1; // Generates a number between 1 and 4
    const bathrooms = Math.floor(Math.random() * 3) + 1; // Generates a number between 1 and 3
    return { bedrooms, bathrooms };
  }

  const generateLotSize = () => {
    const lotSize = Math.floor(Math.random() * 1000) + 1000;
    return lotSize;
  };

  return (
    <div className="grid grid-cols-[300px_300px_300px_300px] px-20 gap-3">
      {data?.map((property: IProperty) => {
        const propertyLotSize = generateLotSize();
        const propertyBed = generateBedroomsAndBathrooms(); // Generate new data for each property
        return (
          <Cards key={property.title} className="relative">
            <Typography
              variant="h5Light"
              className="absolute top-3 left-2 bg-black bg-opacity-60 text-white py-1 px-2 rounded-2xl"
            >
              For Sale
            </Typography>
            <MImage
              src={property.images[0]}
              alt={property.title}
              w={1000}
              h={1000}
              className="w-full h-[200px] object-cover rounded-t-md"
            />
            <div className="p-4">
              <Typography variant="h4">${property.price}</Typography>
              <div className="flex gap-2">
                <Typography variant="h5Light">{propertyBed.bedrooms}</Typography>
                <MdOutlineBedroomParent className="mt-1 text-lg" />
                <Typography className="font-thin text-2xl text-gray-500">|</Typography>
                <Typography variant="h5Light">{propertyBed.bathrooms}</Typography>
                <FaBath className="mt-1 text-lg" />
                <Typography className="font-thin text-2xl text-gray-500">|</Typography>
                <Typography variant="h5Light">
                  {property.lotSize ?? propertyLotSize} sqft
                </Typography>
              </div>
              {/* <Typography variant="h4">{property.location}</Typography> */}
              </div>
          </Cards>
        );
      })}
      <SearchBar/>
    </div>
  );
};
