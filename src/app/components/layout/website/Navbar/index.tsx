import { routes } from "@/app/base/utils/constants";
import { MImage } from "@/app/components/common";
import Link from "next/link";
import React from "react";
import { Images } from "../../../../../../public/images";
import { NavMenu } from "../NavbarMenu";

export const Navbar = (): React.ReactElement => {
    return(
        <div className="grid grid-cols-2 md:grid-cols-[30%_70%] items-center">
            <div className="flex justify-center">
                <Link href={routes.home}>
                    <MImage 
                        src={Images.AppLogo}
                        alt="logo"
                        w={160}
                        h={120}
                        className="mx-auto mt-[-20px]"
                    />
                </Link>
            </div>
            <div className="flex justify-end mr-[60px] lg:mr-[0]">
                <NavMenu />
            </div>
        </div>
    )
}