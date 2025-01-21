import React from "react";
import Link from "next/link";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  href?: string; // Optional href for linking
  type?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '',
  disabled = false,
  href,
}) => {
  const baseClasses =
    'block flex-1 h-[32px] sm:h-[48px] px-6 py-4 mt-4 rounded-md font-bold flex justify-center items-center text-sm sm:text-base text-primary border-2 border-primary focus:outline-none hover:opacity-80 transition-colors';

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed' // Styling for disabled state
    : '';

  // Render as Link if href exists
  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`${baseClasses} ${className} ${disabledClasses}`}
      >
        {children}
      </Link>
    );
  }

  // Render as button if href is not provided
  return (
    <button
      onClick={onClick}
      disabled={disabled} // Ensure the button is properly disabled
      className={`${baseClasses} ${className} ${disabledClasses}`}
    >
      {children}
    </button>
  );
};
