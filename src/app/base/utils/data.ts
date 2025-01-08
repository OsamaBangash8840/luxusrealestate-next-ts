import { StaticImageData } from "next/image";
import { Images } from "../../../../public/images";
import { routes } from "./constants";


export const menu = [
    {name: 'Home', route: routes.home},
    {name: 'Login', route: routes.login},
    {name: 'About', route: routes.about},
    {name: 'Contact', route: routes.contact},
    {name: 'Properties', route: routes.properties},
]


 interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    arrows?: boolean;
    [key: string]: unknown;
  }

export const settings : Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  export interface Slides{
    id: number;
    title: string;
    description: string;
    image : string | StaticImageData;
}

export const slides : Slides[] = [
    {
      id: 1,
      title: "Agents. Tours.Loans. Homes.",
      description: "Embark on an interstellar journey and discover the mysteries of the universe, from distant galaxies to the infinite possibilities of space exploration.",
      image: Images.Slider1,
    },
    {
      id: 2,
      title: "Agents. Tours.Loans. Homes.",
      description: "Venture beyond our planet and uncover the secrets of space. Whether it's the moons of Jupiter or the vast emptiness of deep space, there's always something new to discover.",
      image:Images.Slider2,
    },
    {
      id: 3,
      title: "Agents. Tours.Loans. Homes.",
      description: "Travel across the stars and explore the celestial wonders that make up our universe. From the formation of stars to the breathtaking beauty of nebulae, space holds limitless wonders.",
      image: Images.Slider3,
    },
  ];