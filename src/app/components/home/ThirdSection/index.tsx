import React from "react";
import { Images } from "../../../../../public/images";
import { HomeCards } from "../../common/HomeCards";

const data = [
    { 
        "image" : Images.BuyHome ,
        "title" : "Buy a Property",
        "description" : "Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.",
        "button" : "Search Property"
    },
    {
        "image" : Images.SellHome ,
        "title" : "Sell a Property",
        "description" : "Whether you sell with new Luxus Real Estate Offers™ or take another approach, we’ll help you navigate the path to a successful sale.",
        "button" : "Sell Property"
    },
    {
        "image" : Images.SignIn ,
        "title" : "Sign In",
        "description" : "Access your account, your saved properties, agents, tours, and more. Manage your preferences, track your activities",
        "button" : "Sign In"
    }
];

export const ThirdSection = (): React.ReactElement => {
    return (
        <div className="grid sm:grid-cols-3 mx-[50px] gap-4 mt-5 sm:mt-0">
            {data.map((card, index) => (
                <div key={index}>
                    <HomeCards card={card} />
                </div>
            ))}
        </div>
    );
};
