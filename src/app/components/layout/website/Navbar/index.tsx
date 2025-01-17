import { routes } from "@/app/base/utils/constants";
import { MImage } from "@/app/components/common";
import Link from "next/link";
import React from "react";
import { Images } from "../../../../../../public/images";
import { NavMenu } from "../NavbarMenu";
import { Button } from "@/app/components/common/Button";
import AdminLoginPage from "@/app/(pages)/login/page";

export const Navbar = (): React.ReactElement => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-[20%_50%_25%] items-center lg:mt-[-50px] lg:mb-[-40px]">
            <div className="flex justify-center">
                <Link href={routes.home}>
                    <MImage
                        src={Images.AppLogo}
                        alt="logo"
                        w={220}
                        h={120}
                        className="mx-auto"
                    />
                </Link>
            </div>
            <div className="flex justify-end lg:justify-center mr-[60px] lg:mr-[0]">
                <NavMenu />
            </div>
            {/* Buttons only visible on large screens */}
            <div className="hidden lg:flex gap-4">
                <AdminLoginPage/>
                <Button className="bg-primary text-white" href="">
                    Add Property
                </Button>
            </div>
        </div>
    );
};
