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
    h1: 'text-2xl sm:text-4xl lg:text-6xl !leading-auto font-bold font-heading text-foreground',
    h2: 'text-xl sm:text-3xl lg:text-5xl leading-auto font-bold font-heading text-foreground',
    h3: 'text-lg md:text-3xl lg:text-4xl leading-[34px]! font-bold font-heading text-foreground',
    h4: 'text-lg md:text-2xl lg:text-3xl !leading-2xl font-bold font-heading text-foreground',
    h4Light:
        'text-lg md:text-2xl lg:text-3xl font-normal font-heading text-foreground',
    h5: 'text-base sm:text-xl lg:text-2xl leading-auto font-normal font-heading text-foreground',
    h5Light: 'text-base sm:text-xl lg:text-2xl font-heading text-foreground',
    h5Bold: 'text-base sm:text-xl lg:text-2xl font-medium font-heading text-foreground',

    bodyRegular: 'text-sm sm:text-base font-body text-foreground',
    bodyMedium: 'text-sm sm:text-base font-normal font-body text-foreground',
    bodyBold: 'text-sm sm:text-base font-bold font-body text-foreground',

    smallRegular: 'text-xs sm:text-sm font-body text-foreground',
    smallMedium: 'text-xs sm:text-sm font-medium font-body text-foreground',
    smallBold: 'text-xs sm:text-sm font-bold font-body text-foreground',

    extraSmallRegular:
        'text-[11px] sm:text-xs font-normal font-body text-foreground',
    extraSmallMedium:
        'text-[11px] sm:text-xs font-meduim font-body text-foreground',
    extraSmallBold: 'text-[11px] sm:text-xs font-bold font-body text-foreground',
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
