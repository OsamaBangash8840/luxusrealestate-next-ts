import React from "react";
import Link from "next/link";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  href?: string; // Optional href for linking
  type ?: string;
}

export const Button: React.FC<ButtonProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick,
  children,
  className = '',
  href,
}) => {
  const baseClasses =
    'block flex-1 h-[32px] sm:h-[48px] px-6 py-4 mt-4 rounded-md font-bold flex justify-center items-center text-sm sm:text-base text-primary border-2 border-primary focus:outline-none hover:opacity-80 transition-colors';

  // Render as Link if href exists
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={`${baseClasses} ${className}`}>
        {children}
      </Link>
    );
  }

  // Render as button if href is not provided
  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};
