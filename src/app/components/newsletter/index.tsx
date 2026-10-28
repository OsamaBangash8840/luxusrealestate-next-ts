'use client';
import { useNewsletterMutation } from "@/app/lib/features/contact/contactApiSplice";
import React from "react";
import { Typography, Container } from "../common";
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
    <section className="bg-card border-t border-border py-20">
      <Container className="flex flex-col items-center justify-center text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
          Newsletter
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
          Stay Updated on New Luxury Homes
        </h2>
        <p className="text-sm sm:text-base text-body max-w-xl leading-relaxed mb-8">
          Subscribe to receive notifications when new luxury properties and market insights become available. No spam, unsubscribe anytime.
        </p>
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-md flex flex-col items-center"
        >
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={payload.email}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full py-3.5 pl-5 pr-36 text-sm text-foreground bg-background border border-input rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`absolute top-1/2 -translate-y-1/2 right-1.5 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition ${
              isLoading
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isLoading ? "Submitting..." : "Subscribe"}
          </button>
        </form>
        {errors.email && (
          <p className="mt-3 text-destructive text-xs font-medium">{errors.email}</p>
        )}
        {errors.apiError && (
          <p className="mt-3 text-destructive text-xs font-medium">{errors.apiError}</p>
        )}
      </Container>
    </section>
  );
};
