'use client';
import { useNewsletterMutation } from "@/app/lib/features/contact/contactApiSplice";
import React from "react";
import { Typography } from "../common";
import { toast } from "react-toastify";

interface IPayload {
  email: string;
}

export const Newsletter = (): React.ReactElement => {
  const [errors, setErrors] = React.useState<{ email?: string; apiError?: string }>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [payload, setPayload] = React.useState<IPayload>({
    email: "",
  });

  const [newsletter] = useNewsletterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
    const newErrors: { email?: string } = {};
    if (!payload.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(payload.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await newsletter(payload).unwrap();
      setPayload({ email: "" });
      toast.success("Subscribed successfully");
      setErrors({});
    } catch (error: any) {
      setErrors({
        ...errors,
        apiError: error?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 sm:mt-0 justify-center h-[290px] px-8 bg-primary">
      <Typography variant="h2" className=" md:w-[50%] text-center sm:text-3xl font-semibold text-white mb-6">
      Subscribe to our newsletter to get the latest updates on properties!
      </Typography>
      <Typography variant="bodyRegular" className="text-white md:w-[30%] leading-4 mb-5 text-center">
      Stay informed with the newest property listings, trends, and updates delivered straight to your inbox.
      </Typography>
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md flex flex-col items-center"
      >
        <input
          type="email"
          name="email"
          placeholder="example@example.com"
          value={payload.email}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full py-3 pl-4 pr-[6rem] text-[12px] sm:text-[16px] text-primary bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`absolute bg-primary top-1/2 -translate-y-1/2 right-2 px-4 py-2 font-medium rounded-full transition ${
            isLoading
              ? "bg-gray-400 text-gray-700"
              : "bg-secondary text-white hover:bg-blue-500 hover:text-secondary"
          }`}
        >
          {isLoading ? "Submitting..." : "Subscribe"}
        </button>
      </form>
      {errors.email && (
        <p className="mt-4 text-red-400 text-sm">{errors.email}</p>
      )}
      {errors.apiError && (
        <p className="mt-2 text-red-400 text-sm">{errors.apiError}</p>
      )}
    </div>
  );
};
