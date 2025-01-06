'use client'

import React, { useState } from "react";
import { routes, USER_DATA } from '@/app/base/utils/constants';
import { useLoginMutation } from '../../../lib/features/auth/authApiSlice';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Link from "next/link";

interface IPayLoad {
  email: string;
  password: string;
}

export const LoginMain = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState<IPayLoad>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<{ email?: string, password?: string }>({});
  const router = useRouter();
  const [login] = useLoginMutation();

  // OnChange event handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.name;
    const value = e.target.value;

    setPayload({
      ...payload,
      [name]: value,
    });

    // Clear the error for the field that is being modified
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { email?: string, password?: string } = {};

    if (!payload.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(payload.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!payload.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    // If there are any errors, return false
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    setIsLoading(true); // Start loading

    try {
        const data = await login(payload).unwrap();
        setCookie(USER_DATA, data); // Set cookie with user data
        router.push(routes.home); // Redirect after successful login
    } catch (error) {
        console.error("Login failed:", error);
        setErrors({ email: "Invalid email or password", password: "Invalid email or password" });
    } finally {
        setIsLoading(false); // Stop loading
    }
};


  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center mb-10 mt-28 ml-2 xl:mx-8 rounded bg-transparent"
      style={{
        backgroundImage: "url('https://i.redd.it/islamia-college-peshawar-pakistan-v0-zyy8lfo8zcx91.jpg?width=1080&format=pjpg&auto=webp&s=e20bb64198f994ee95777c183716ecca191af150')",
        opacity: '90%',
      }}
    >
      <div className="flex flex-col max-w-md p-6 mt-4 mb-32 ml-[1px] rounded-md sm:p-10 opacity-100 bg-black dark:bg-gray-50 text-black">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold text-white">Login</h1>
          <p className="text-sm text-white">Sign in to access your account</p>
        </div>
        <form noValidate className="space-y-12" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 lg:mr-[280px] text-white text-sm">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="leroy@jenkins.com"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
                value={payload.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm text-white">Password</label>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="***"
                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800"
                value={payload.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              <Link href="/forgot-password" className="text-xs lg:mr-64 text-white hover:underline">Forgot password?</Link>
            </div>
          </div>
          <div className="space-y-2">
            <div>
            <button
              type="submit"
              className="w-full px-8 py-3 font-semibold mb-2 rounded-md bg-white text-black hover:bg-yellow-500 hover:text-black hover:scale-110"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
           </button>
            </div>
            <p className="px-6 text-sm text-center text-white"> Don&#39;t have an account yet?
              <Link href="/signup" className="hover:underline text-white">Sign up</Link> .
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
