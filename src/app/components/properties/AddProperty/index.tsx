'use client';
import { useAddPropertyMutation } from "@/app/lib/features/properties/propertiesApiSlice";
import { IPropertiesPayload } from "@/app/lib/features/properties/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Typography } from "../../common";
import { UploadImageField } from "../../form/ImageUpload";


export const AddProperty = (): React.ReactElement => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [payload, setPayload] = useState<IPropertiesPayload>({
        title: "",
        description: "",
        price: 0,
        location: "",
        type: "",
        buildYear: 0,
        size: 0, // Changed to number
        lotSize: 0, // Changed to number
        amenities: [],
        images: [],
        mapLocation: { lat: 0, lng: 0 },
        reviews: [],
        category: ""
    });

    const router = useRouter();
    const [addProperty] = useAddPropertyMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
    
        if (name === "mapLocationLat" || name === "mapLocationLng") {
            setPayload({
                ...payload,
                mapLocation: {
                    ...payload.mapLocation,
                    [name === "mapLocationLat" ? "lat" : "lng"]: +value, // Ensure you store values as numbers
                }
            });
        } else {
            setPayload({
                ...payload,
                [name]: name === 'price' || name === 'size' || name === 'lotSize' ? +value : value,
            });
        }
    };
    

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!payload.title) newErrors.title = 'Title is required';
        if (!payload.description) newErrors.description = 'Description is required';
        if (!payload.price) newErrors.price = 'Price is required';
        if (!payload.location) newErrors.location = 'Location is required';
        if (!payload.type) newErrors.type = 'Type is required';
        if (!payload.buildYear) newErrors.buildYear = 'Build year is required';
        if (!payload.size) newErrors.size = 'Size is required';
        if (!payload.lotSize) newErrors.lotSize = 'Lot size is required';
        if (!payload.amenities.length) newErrors.amenities = 'At least one amenity is required';
        if (!payload.images.length) newErrors.images = 'At least one image is required';
        if (!payload.mapLocation.lat || !payload.mapLocation.lng) newErrors.mapLocation = 'Map location is required';
        if (!payload.reviews.length) newErrors.reviews = 'At least one review is required';
        if (!payload.category) newErrors.category = 'Category is required';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await addProperty(payload).unwrap();
            setLoading(false);
            router.push('/');
            toast.success(`${response.title} added successfully!`);
        } catch (error) {
            setLoading(false);
            toast.error('Failed to add property. Please try again.');
            console.error('Failed to add property:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Title</Typography>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={payload.title}
                        onChange={handleChange}
                        placeholder="Property Title"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
                </div>

                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Description</Typography>
                    <textarea
                        id="description"
                        name="description"
                        value={payload.description}
                        onChange={handleChange}
                        placeholder="Property Description"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                </div>

                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Price</Typography>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        value={payload.price}
                        onChange={handleChange}
                        placeholder="Property Price"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price}</p>}
                </div>
                
                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Location</Typography>
                    <input
                        id="location"
                        name="location"
                        type="text"
                        value={payload.location}
                        onChange={handleChange}
                        placeholder="Property Location"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
                </div>

                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Build Year</Typography>
                    <input
                        id="buildYear"
                        name="buildYear"
                        type="number"
                        value={payload.buildYear}
                        onChange={handleChange}
                        placeholder="Property Build Year"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.buildYear && <p className="text-red-500 text-sm mt-2">{errors.buildYear}</p>}
                </div>

                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Size (sqft)</Typography>
                    <input
                        id="size"
                        name="size"
                        type="number"
                        value={payload.size}
                        onChange={handleChange}
                        placeholder="Property Size"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.size && <p className="text-red-500 text-sm mt-2">{errors.size}</p>}
                </div>

                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Lot Size (sqft)</Typography>
                    <input
                        id="lotSize"
                        name="lotSize"
                        type="number"
                        value={payload.lotSize}
                        onChange={handleChange}
                        placeholder="Lot Size"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lotSize && <p className="text-red-500 text-sm mt-2">{errors.lotSize}</p>}
                </div>

                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Amenities</Typography>
                    <input
                        id="amenities"
                        name="amenities"
                        type="text"
                        value={payload.amenities.join(", ")}
                        onChange={(e) => handleChange({
                            target: { name: 'amenities', value: e.target.value.split(', ') }
                        } as unknown as React.ChangeEvent<HTMLInputElement>)}
                        placeholder="Amenities (comma separated)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.amenities && <p className="text-red-500 text-sm mt-2">{errors.amenities}</p>}
                </div>

                <div className="mb-6">
                   <Typography variant="h5" className="text-black mb-2">Map Location Lat</Typography>
                   <input
                        id="mapLocationLat" // Name updated here to match the handleChange logic
                        name="mapLocationLat" // Name updated here to match the handleChange logic
                        type="number"
                        value={payload.mapLocation.lat}
                        onChange={handleChange}
                        placeholder="Latitude"
                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                   {errors.mapLocation && <p className="text-red-500 text-sm mt-2">{errors.mapLocation}</p>}
                </div>

               <div className="mb-6">
                 <Typography variant="h5" className="text-black mb-2">Map Location Lng</Typography>
                 <input
                     id="mapLocationLng" // Name updated here to match the handleChange logic
                     name="mapLocationLng" // Name updated here to match the handleChange logic
                     type="number"
                     value={payload.mapLocation.lng}
                     onChange={handleChange}
                     placeholder="Longitude"
                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                   {errors.mapLocation && <p className="text-red-500 text-sm mt-2">{errors.mapLocation}</p>}
                 </div>

                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Category</Typography>
                    <input
                        id="category"
                        name="category"
                        type="text"
                        value={payload.category}
                        onChange={handleChange}
                        placeholder="Category"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
                </div>

                <div className="mb-6">
                    <UploadImageField label="Upload Property Pictures" multiple />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {loading ? "Adding..." : "Add Property"}
                    </button>
                </div>
            </form>
        </div>
    );
};
