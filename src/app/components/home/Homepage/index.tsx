import React from "react";
import {HeroSection} from "../HeroSection";
import { ThirdSection } from "../ThirdSection";
import { ForthSection } from "../ForthSection";
import { Newsletter } from "../../newsletter";


export const Homepage = (): React.ReactElement => {
    return(
    <main className="flex flex-col">
        <HeroSection/>
        <ThirdSection/>
        <ForthSection/>
        <Newsletter/>
    </main>
    )
}