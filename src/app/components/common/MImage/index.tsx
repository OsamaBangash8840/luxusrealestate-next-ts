import Image, { type StaticImageData } from 'next/image';
import React from 'react';

interface IImage {
    src: string | StaticImageData;
    w: number;
    h: number;
    alt: string;
    className?: string;
    style?: React.CSSProperties
}

export const MImage = ({
    src,
    w,
    h,
    alt,
    className,
    style,
    ...rest
}: IImage): React.ReactElement => (
    <Image
        src={src}
        width={w}
        height={h}
        alt={alt}
        className={`${className}`}
        style={style}
        {...rest}
    />
);
