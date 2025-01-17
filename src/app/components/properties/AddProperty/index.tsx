'use client';
import { useAddPropertyMutation } from "@/app/lib/features/properties/propertiesApiSlice";
import { IPropertiesPayload } from "@/app/lib/features/properties/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Typography } from "../../common";
import axios from "axios";

export const AddProperty = (): React.ReactElement => {
    const [loading, setLoading] = useState(false);
    const [payload, setPayload] = useState<IPropertiesPayload>({
        title: "",
        description: "",
        price: 0,
        location: "",
        type: "",
        buildYear: 0,
        size: 0,
        lotSize: 0,
        amenities: [],
        images: [],
        mapLocation: { lat: 0, lng: 0 },
        reviews: [],
        category: "",
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
                    [name === "mapLocationLat" ? "lat" : "lng"]: +value,
                },
            });
        } else if (["price", "size", "lotSize", "buildYear"].includes(name)) {
            setPayload({
                ...payload,
                [name]: +value,
            });
        } else {
            setPayload({
                ...payload,
                [name]: value,
            });
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (!e.target.files) return;

        const formData = new FormData();
        Array.from(e.target.files).forEach((file) => formData.append("files", file));

        try {
            const res = await axios.post("http://localhost:8000/api/upload", formData);
            const uploadedImageUrls = res.data.map((file: { imageUrl: string }) => file.imageUrl);
            setPayload({ ...payload, images: uploadedImageUrls });
            toast.success("Images uploaded successfully!");
        } catch (err) {
            console.error("Image upload failed:", err);
            toast.error("Image upload failed");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
    
        console.log("Payload being sent:", payload); // Debug payload
    
        setLoading(true);
        try {
            const response = await addProperty(payload).unwrap();
            console.log("Response:", response); // Debug response
            toast.success(`${response.title} added successfully!`);
            setLoading(false);
            router.push("/");
        } catch (err) {
            setLoading(false);
            console.error("Error:", err); // Debug error
            toast.error("Failed to add property. Please try again.");
        }
    };
    

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Title</Typography>
                    <input
                        name="title"
                        value={payload.title}
                        onChange={handleChange}
                        placeholder="Property Title"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
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
                </div>

                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Amenities</Typography>
                    <input
                        name="amenities"
                        value={payload.amenities.join(", ")}
                        onChange={(e) =>
                            setPayload({ ...payload, amenities: e.target.value.split(", ") })
                        }
                        placeholder="Amenities (comma-separated)"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>

                <div className="mb-6">
                    <Typography variant="h5" className="text-black mb-2">Images</Typography>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                </div>
                
                <div className="mb-6">
                      <Typography variant="h5" className="text-black mb-2">Property Type</Typography>
                  <input
                   name="category" // Ensure the name matches the payload property
                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                   type="text"
                    placeholder="Category"
                    value={payload.category}
                     onChange={handleChange} // This will now correctly update the payload
    />
</div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 bg-blue-500 text-white rounded-lg"
                >
                    {loading ? "Adding..." : "Add Property"}
                </button>
            </form>
        </div>
    );
};
