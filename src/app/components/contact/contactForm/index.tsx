'use client';

import React, { useState } from "react";
import { useContactMutation } from "@/app/lib/features/contact/contactApiSplice";

interface IPayload {
  name: string;
  email: string;
  message: string;
  mobile: string;
}

export const ContactForm = (): React.ReactElement => {
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string; mobile?: string; apiError?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState<IPayload>({
    name: "",
    email: "",
    message: "",
    mobile: "",
  });
  

  const [contact] = useContactMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;

    setPayload({
      ...payload,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
      apiError: "",
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; message?: string; mobile?: string } = {};
    if (!payload.name) {
      newErrors.name = "Name is required";
    }
    if (!payload.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(payload.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!payload.message) {
      newErrors.message = "Message is required";
    }
    if (!payload.mobile || !/^[0-9]{10,11}$/.test(payload.mobile.toString())) {
        newErrors.mobile = "Valid mobile number (10-11 digits) is required";
    }
    
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }
    setIsLoading(true);
    
    console.log("Payload before sending:", payload);  // Check if the data structure is correct

    try {
        await contact(payload).unwrap();
        setPayload({
            name: "",
            email: "",
            message: "",
            mobile: "",
        });
        setErrors({});
    } catch (err: any) {
        console.error("API Error:", err);
        if (err.data?.errors) {
            console.log("Backend validation errors:", err.data.errors);  // Log errors from backend
            const backendErrors = err.data.errors.reduce((acc: any, error: any) => {
                acc[error.param] = error.msg;
                return acc;
            }, {});
            setErrors(backendErrors);
        } else {
            setErrors({ apiError: "An error occurred while submitting the form." });
        }
    } finally {
        setIsLoading(false);
    }
};



  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
      {errors.apiError && <p className="text-red-500 text-sm mb-4">{errors.apiError}</p>}
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={payload.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring focus:ring-blue-200`}
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={payload.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring focus:ring-blue-200`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="mobile" className="block text-gray-600 mb-1">
            Mobile <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={payload.mobile}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.mobile ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring focus:ring-blue-200`}
            placeholder="Enter your mobile number"
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-600 mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={payload.message}
            onChange={handleChange}
            rows={4}
            className={`w-full p-2 border rounded-md ${
              errors.message ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring focus:ring-blue-200`}
            placeholder="Enter your message"
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};
