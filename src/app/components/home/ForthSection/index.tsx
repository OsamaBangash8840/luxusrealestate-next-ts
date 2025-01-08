import React from "react";
import { MImage, Typography } from "../../common";
import { Images } from "../../../../../public/images";
import { Button } from "../../common/Button";

export const ForthSection = (): React.ReactElement => {
    return(
        <div className="grid sm:grid-cols-2 gap-2 sm:mx-[200px]">
            <MImage
            src={Images.SecondSecImage}
            w={400}
            h={300}
            alt="SecFourImage"
            className="mx-auto rounded-lg"
            />
            <div className="sm:mt-10 items-center text-center sm:text-start">
                <Typography variant="h2">Find it. Love it. Reserve it.</Typography>
                <Typography variant="h5Light" className="w-full mt-3">Imagine and price out your home completely online. Whether it’s under construction, ready now or if you want to build from the ground up, a simple $100 refundable home reservation will take your future home off the market.
                </Typography>
                <Button className="mx-auto sm:mx-0">Explore More</Button>
            </div>
        </div>
    )
}