import React from "react";
import {HeroSection} from "../HeroSection";
import { SecondComp } from "../SecondSection";
import { ThirdSection } from "../ThirdSection";
import { ForthSection } from "../ForthSection";
import { Newsletter } from "../../newsletter";


export const Homepage = (): React.ReactElement => {
    return(
    <>
    <HeroSection/>
    <SecondComp/>
    <ThirdSection/>
    <ForthSection/>
    <Newsletter/>
    </>
    )
}