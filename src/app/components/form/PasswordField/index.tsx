'use client';

import React, { useState, type InputHTMLAttributes } from 'react';
import { Typography } from '../../common';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    placeholder: string;
    className?: string;
    icon?: React.ReactNode;
}

export const PasswordField = ({
    label,
    placeholder,
    className,
    icon = null,
    ...rest
}: Props): React.ReactElement => {
    const [show, setShow] = useState<boolean>(false);
    return (
        <div className={`${className}`}>
            {typeof label !== 'undefined' && (
                <Typography className="block mb-1.5">{label}</Typography>
            )}
            <div className="relative w-full">
                {icon !== null && (
                    <span className="text-secondary opacity-40 text-lg md:text-xl absolute left-5 top-1/2 -translate-y-1/2">
                        {icon}
                    </span>
                )}
                <input
                    type={show ? 'text' : 'password'}
                    placeholder={placeholder}
                    className={`w-full placeholder:text-secondary/30 bg-boxColorDark text-secondary h-[46px] xl:h-[56px] rounded-full outline-none border border-boxOutline focus:border-primary bg-opacity-80 text-sm sm:text-base ${icon !== null ? 'pr-6 pl-[54px]' : 'px-6'}`}
                    {...rest}
                />
                <button
                    type="button"
                    className="text-secondary text-lg md:text-xl absolute right-5 top-1/2 -translate-y-1/2"
                    onClick={() => {
                        setShow(prev => !prev);
                    }}
                >
                    {show ? <FiEyeOff /> : <FiEye />}
                </button>
            </div>
        </div>
    );
};
