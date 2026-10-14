import { Typography } from '../../common'
import { IoIosSearch } from "react-icons/io";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../shadcn/tabs'

export const HeroSection = () => {
  return (
    <section
      className="relative h-[620px] flex items-center justify-center bg-cover bg-center border border-b-2 border-black/8"
  
    >
      {/* Overlay */}
      {/* <div className="absolute i"></div> */}

      {/* Content */}
      <div className="relative z-10 text-center px-4 w-full">
        <Typography variant='h1' >
          Find your space.
        </Typography>
        <Typography variant='h5' className='mt-12 !text-secondaryLight' >
          Discover exceptional properties carefully curated for modern living.
        </Typography>

        {/* Search Box Tabs */}
        <div className="mt-10 mx-auto w-full max-w-4xl">
          <SearchForm/>
        </div>
            <Tabs defaultValue="buy" className="w-full flex items-center justify-center mt-36 !space-x-20 !gap-8">
            <TabsList className="mb-2 p-1.5 !bg-white">
              <TabsTrigger value="buy" className="px-8 py-2 text-base !text-black font-medium bg-secondary rounded-md">Houses</TabsTrigger>
              <TabsTrigger value="rent" className="px-8 py-2 text-base !text-black font-medium bg-secondary rounded-md">Apartments</TabsTrigger>
              <TabsTrigger value="sell" className="px-8 py-2 text-base !text-black font-medium bg-secondary rounded-md">Villas</TabsTrigger>
              <TabsTrigger value="sell" className="px-8 py-2 text-base !text-black font-medium bg-secondary rounded-md">Commercial</TabsTrigger>
            </TabsList>

            {/* <TabsContent value="buy" className="w-full mt-2">
              <SearchForm />
            </TabsContent>
            
            <TabsContent value="rent" className="w-full mt-2">
              <SearchForm />
            </TabsContent>
            
            <TabsContent value="sell" className="w-full mt-2">
              <SearchForm />
            </TabsContent> */}
          </Tabs>
      </div>
    </section>
  )
}

const SearchForm = () => {
  return (
    <div className="flex items-center bg-white rounded-[8px] p-2 border border-black/8">
      {/* Location */}
      <div className="flex flex-col flex-1 pl-6 pr-4">
        <label htmlFor="search" className="text-sm font-semibold text-foreground text-left">Location</label>
        <input
          type="text"
          id="search"
          placeholder="City, neighborhood, or zip"
          className="w-full text-base text-gray-500 placeholder-secondaryLight bg-transparent focus:outline-hidden border-none p-0 mt-0.5"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-gray-200"></div>

      {/* Property Type */}
      <div className="flex flex-col flex-1 pl-6 pr-4">
        <label className="text-sm font-semibold text-foreground text-left">Property Type</label>
        <input
          type="text"
          placeholder="Any type"
          className="w-full text-base text-gray-500 placeholder-secondaryLight bg-transparent focus:outline-hidden border-none p-0 mt-0.5"
        />
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-gray-200"></div>

      {/* Price Range */}
      <div className="flex flex-col flex-1 pl-6 pr-4">
        <label className="text-sm font-semibold text-foreground text-left">Price Range</label>
        <input
          type="text"
          placeholder="Any price"
          className="w-full text-base text-gray-500 placeholder-secondaryLight bg-transparent focus:outline-hidden border-none p-0 mt-0.5"
        />
      </div>

      {/* Search Button */}
      <button className="bg-primary hover:opacity-90 transition-opacity text-white w-14 h-14 rounded-full flex items-center justify-center shrink-0 cursor-pointer">
        <IoIosSearch className='text-2xl text-white'/>
      </button>
    </div>
  )
}
