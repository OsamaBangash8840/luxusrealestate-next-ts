'use client';

import React, { useState } from "react";
import { routes, USER_DATA } from '@/app/base/utils/constants';
import { useLoginMutation } from '../../../lib/features/auth/authApiSlice';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { Button } from "../../common/Button";
import { Modal } from "../../common/Modal";
import GoogleAuth from "@/app/(pages)/capsules/page";
import { TextField } from "../../form";
import { Typography } from "../../common";
import { toast } from "react-toastify";

interface IPayLoad {
  email: string;
  password: string;
}

export const LoginMain = (): React.ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState<IPayLoad>({
    email: '',
    password: ''
  });
  const [isOpen,setIsOpen]= useState<boolean>(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();
  const [login] = useLoginMutation();

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setPayload({
      ...payload,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: '',
    });
  };

  // Validate Form
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!payload.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(payload.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!payload.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const data = await login(payload).unwrap();
      setCookie(USER_DATA, JSON.stringify(data), { maxAge: 60 * 60 * 24 }); // Store user data in cookie for 24 hours
      console.log(setCookie)
      router.push(routes.home); // Redirect to the home page
      toast.success(`Successfully Logged In`)
    } catch (error) {
      setErrors({ email: 'Invalid credentials', password: 'Invalid credentials' });
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Button onClick={()=> setIsOpen(true)}>Sign In</Button>
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="flex  w-full overflow-hidden rounded-lg">
          {/* Left Section */}
          <div className="w-1/2 bg-gradient-to-br from-blue-600 to-primary text-white p-8 flex flex-col justify-center">
            <Typography variant='h3' className="text-white mb-2">Luxus Real Estate</Typography>
            <Typography variant='extraSmallRegular' className="text-white">Step into Luxury Living – Sign In with Luxus Real Estate Today!.</Typography>
          </div>

          {/* Right Section */}
          <div className="w-[70%] bg-white p-8">
            <Typography variant='h1' className=" text-blue-700 mb-6">Sign up</Typography>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                name="email"
                placeholder="Enter your email"
                value={payload.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}

              <TextField
                name="password"
                placeholder="Enter your password"
                type="password"
                value={payload.password}
                onChange={handleChange}
              />
              {errors.password && <p className="error">{errors.password}</p>}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:opacity-90 text-white font-bold py-2 rounded-lg"
              >
                Login 
              </Button>
              <GoogleAuth/>
            </form>
          </div>
        </div>
      </Modal>
              </>
  );
};
