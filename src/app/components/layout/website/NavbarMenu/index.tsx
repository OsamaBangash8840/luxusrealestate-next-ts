'use client'
import { menu } from "@/app/base/utils/data";
import Link from "next/link";
import React, { useState } from "react";
import { Typography } from "../../../common";
import { Button } from "@/app/components/common/Button";
import AdminLoginPage from "@/app/(pages)/login/page";

export const NavMenu = (): React.ReactElement => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="relative">
            {/* Hamburger Icon for Small and Medium Screens */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="block md:block lg:hidden text-black focus:outline-none"
            >
                <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {isMenuOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    )}
                </svg>
            </button>

            {/* Navigation Menu */}
            <ul
                className={`${
                    isMenuOpen ? "flex" : "hidden"
                } fixed inset-0 bg-white bg-opacity-90 flex-col justify-center items-center gap-6 z-50 p-4 lg:flex lg:relative lg:bg-transparent lg:inset-auto lg:flex-row`}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-6 right-6 text-primary focus:outline-none lg:hidden"
                >
                    <svg
                        className="w-8 h-8"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Navigation Items */}
                {menu.map((item, index) => (
                    <li key={index} className="text-black text-center mx-auto">
                        <Link href={item.route}>
                            <span onClick={() => setIsMenuOpen(false)}>
                                <Typography
                                    variant="h5Light"
                                    className="hover:underline text-primary lg:text-black"
                                >
                                    {item.name}
                                </Typography>
                            </span>
                        </Link>
                    </li>
                ))}

                {/* Buttons for Small Screens */}
                <div className="flex flex-col items-center gap-4 lg:hidden">
                    <AdminLoginPage/>
                    <Button className="border-gray-400 text-gray-400" href="">
                        Add Property
                    </Button>
                </div>
            </ul>
        </nav>
    );
};

