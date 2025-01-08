import React from "react";
import { MImage, Typography } from "../../common";
import { Button } from "../../common/Button";
import { Images } from "../../../../../public/images";


export const SecondComp = ():React.ReactElement => (
    <div className="grid sm:grid-cols-2 sm:gap-4">
        <div className=" sm:p-32 p-16 items-center mx-auto">
            <Typography variant="h2">Get home recommendations </Typography>
            <Typography variant="h5Light" className="mt-4">Sign in for a more personalized experience.</Typography>
            <Button className="px-6 py-4 mt-4 rounded-md font-bold">Sign In</Button>
        </div>
        <MImage
            src={Images.SecondSecImage}
            w={500}
            h={500}
            alt="SecondSecImage"
            className="mt-[-40px] sm:mt-0"
        ></MImage>
    </div>
) 