import React, { type ElementType } from 'react';

type variant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h4Light'
    | 'h5'
    | 'h5Light'
    | 'h5Bold'
    | 'bodyRegular'
    | 'bodyMedium'
    | 'bodyBold'
    | 'smallRegular'
    | 'smallMedium'
    | 'smallBold'
    | 'extraSmallRegular'
    | 'extraSmallMedium'
    | 'extraSmallBold';

const tags: Record<variant, ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h4Light: 'h4',
    h5: 'h5',
    h5Light: 'h5',
    h5Bold: 'h5',

    bodyRegular: 'p',
    bodyMedium: 'p',
    bodyBold: 'p',

    smallRegular: 'p',
    smallMedium: 'p',
    smallBold: 'p',

    extraSmallBold: 'span',
    extraSmallMedium: 'span',
    extraSmallRegular: 'span',
};

const sizes: Record<variant, string> = {
    h1: 'text-xl sm:text-2xl lg:text-3xl !leading-auto font-bold font-heading text-secondary',
    h2: 'text-xl sm:text-xl lg:text-[26px] leading-auto font-bold font-heading text-secondary',
    h3: 'text-lg md:text-xl lg:text-[22px] !leading-[34px] font-bold font-heading text-secondary',
    h4: 'text-lg md:text-xl lg:text-xl !leading-2xl font-bold font-heading text-secondary',
    h4Light:
        'text-lg md:text-xl lg:text-xl font-normal font-heading text-secondary',
    h5: 'text-base sm:text-lg leading-auto font-normal font-heading text-secondary',
    h5Light: 'text-base sm:text-lg font-heading text-secondary',
    h5Bold: 'text-base sm:text-lg font-medium font-heading text-secondary',

    bodyRegular: 'text-sm sm:text-base font-body text-secondary',
    bodyMedium: 'text-sm sm:text-base font-normal font-body text-secondary',
    bodyBold: 'text-sm sm:text-base font-bold font-body text-secondary',

    smallRegular: 'text-xs sm:text-sm font-body text-secondary',
    smallMedium: 'text-xs sm:text-sm font-medium font-body text-secondary',
    smallBold: 'text-xs sm:text-sm font-bold font-body text-secondary',

    extraSmallRegular:
        'text-[11px] sm:text-xs font-normal font-body text-secondary',
    extraSmallMedium:
        'text-[11px] sm:text-xs font-meduim font-body text-secondary',
    extraSmallBold: 'text-[11px] sm:text-xs font-bold font-body text-secondary',
};

interface Props {
    variant?: variant;
    children: React.ReactNode;
    className?: string;
    as?: ElementType;
}

export const Typography = ({
    variant = 'bodyRegular',
    children,
    className,
    as,
}: Props): React.ReactElement => {
    const sizesCalsses = sizes[variant];
    const Tag = as ?? tags[variant];
    return <Tag className={`${sizesCalsses} ${className}`}>{children}</Tag>;
};
