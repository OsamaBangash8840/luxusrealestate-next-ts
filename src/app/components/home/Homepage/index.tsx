import React from "react";
import {HeroSection} from "../HeroSection";
import { SecondComp } from "../SecondSection";
import { ThirdSection } from "../ThirdSection";
import { ForthSection } from "../ForthSection";


export const Homepage = (): React.ReactElement => {
    return(
    <>
    <HeroSection/>
    <SecondComp/>
    <ThirdSection/>
    <ForthSection/>
    </>
    )
}