import React from "react";
import { MImage } from "../MImage";
import { StaticImageData } from "next/image";
import { Typography } from "../Typography";
import { Button } from "../Button";


interface ICard {
    image : string | StaticImageData,
    title: string,
    description : string,
    button : React.ReactNode;
}

export const HomeCards = ({card}:{card:ICard}): React.ReactElement => {
    return (
        <div className="border border-gray-200 shadow-lg p-4 sm:mb-12 mb-6 rounded-lg">
            <MImage
            src={card.image}
            w={500}
            h={500}
            alt="Cards Image"
            className="w-[200px] h-[200px] mx-auto"
            />
            <Typography variant="h2" className="text-center my-3">{card.title}</Typography>
            <Typography variant="bodyRegular" className="text-center">{card.description}</Typography>
            <Button className="mx-auto mb-3">{card.button}</Button>
        </div>
    )
}