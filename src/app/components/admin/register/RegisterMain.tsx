'use client';

import React, { useState } from 'react';
import { routes, USER_DATA } from '@/app/base/utils/constants';
import { useRegisterMutation } from '../../../lib/features/auth/register/registerApiSlice';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';
import { TextField } from '../../form';

interface IPayLoad {
  name: string;
  email: string;
  password: string;
}

export const RegisterMain = (): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<IPayLoad>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const [register] = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const data = await register(payload).unwrap();
      setCookie(USER_DATA, data);
      router.push(routes.login);
    } catch (error) {
      // Handle errors, if any (e.g., validation errors from the backend)
      setErrors((error as any)?.data?.errors || {});
    }
  };

  return (
    <>
    <Button onClick={() => setIsOpen(true)}>Sign Up</Button>
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <TextField name="name" placeholder='name' value={payload.name} onChange={handleChange} />
        <span>{errors.name}</span>
        <label htmlFor="email">Email</label>
        <TextField name="email" placeholder='email' value={payload.email} onChange={handleChange} />
        <span>{errors.email}</span>
        <label htmlFor="password">Password</label>
        <TextField name="password" placeholder='password' value={payload.password} onChange={handleChange} />
        <span>{errors.password}</span>
      </form>
      </Modal>
    </>
  );
};
