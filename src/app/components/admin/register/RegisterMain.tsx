'use client';
import React, { useState } from 'react';
import { routes } from '@/app/base/utils/constants';
import { useRegisterMutation } from '../../../lib/features/auth/register/registerApiSlice';
import { useRouter } from 'next/navigation';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { TextField } from '../../form';
import { Typography } from '../../common';
import GoogleAuth from '@/app/(pages)/capsules/page';
import { toast } from 'react-toastify';

interface IPayLoad {
  name: string;
  email: string;
  password: string;
}

export const RegisterMain = (): React.ReactElement => {
  const [error,setErrors] = useState<{ name?:string ;email?: string; password?: string }>({})
  const [isOpen, setIsOpen] = useState(false); // Modal open state
  const [payload, setPayload] = useState<IPayLoad>({
    name: '',
    email: '',
    password: '',
  });
  const router = useRouter();
  const [register] = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));

    setErrors({
      ...error,
      [name]: '',
    });
  };

    // Validate Form
    const validateForm = (): boolean => {
      const newErrors: { name?: string; email?: string; password?: string } = {};
  
      if (!payload.name){
        newErrors.name = 'Name is required';
      }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if(!validateForm()) return

    try {
      const data = await register(payload).unwrap();
      console.log(data);
      router.push(routes.login);
      toast.success(`User ${name} has successfully Registered`)
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register. Please try again.');
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Sign Up</Button> {/* Button triggers modal */}
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="flex  w-full overflow-hidden rounded-lg">
          {/* Left Section */}
          <div className="w-1/2 bg-gradient-to-br from-blue-600 to-primary text-white p-8 flex flex-col justify-center">
            <Typography variant='h3' className="text-white mb-2">Luxus Real Estate</Typography>
            <Typography variant='extraSmallRegular' className="text-white">Step into Luxury Living – Sign Up with Luxus Real Estate Today!.</Typography>
          </div>

          {/* Right Section */}
          <div className="w-[70%] bg-white p-8">
            <Typography variant='h1' className=" text-blue-700 mb-6">Sign up</Typography>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                name="name"
                placeholder="Enter your name"
                value={payload.name}
                onChange={handleChange}
              />
              {error.name && <p className="error">{error.name}</p>}

              <TextField
                name="email"
                placeholder="Enter your email"
                value={payload.email}
                onChange={handleChange}
              />
              {error.email && <p className="error">{error.email}</p>}

              <TextField
                name="password"
                placeholder="Enter your password"
                type="password"
                value={payload.password}
                onChange={handleChange}
              />
              {error.password && <p className="error">{error.password}</p>}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:opacity-90 text-white font-bold py-2 rounded-lg"
              >
                Register
              </Button>
              <GoogleAuth/>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};
