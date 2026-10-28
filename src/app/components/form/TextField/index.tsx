import React, { type InputHTMLAttributes } from 'react';
import { Typography } from '../../common';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    type?: 'text' | 'number' | 'email' | 'password'; // Restrict type to valid input types
    placeholder: string;
    className?: string;
    icon?: React.ReactNode;
    inputClass?: string;
}

export const TextField = ({
    label,
    type = 'text', // Default to 'text'
    placeholder,
    className,
    icon = null,
    inputClass,
    ...rest
}: Props): React.ReactElement => (
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
                type={type} // Accepts only 'text' or 'number'
                placeholder={placeholder}
                className={`w-full placeholder:text-secondary/50 bg-background text-foreground h-[46px] xl:h-[56px] rounded-none outline-none border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm sm:text-base transition-colors ${
                    icon !== null ? 'pr-6 pl-[54px]' : 'px-6'
                } ${inputClass || ''}`}
                {...rest}
            />
        </div>
    </div>
);
