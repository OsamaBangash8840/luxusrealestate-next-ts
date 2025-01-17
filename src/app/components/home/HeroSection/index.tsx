import { Typography } from "../../common";

export const HeroSection = () => {
    return (
        <section
            className="relative h-[520px] flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url('/images/2147941488.jpg')`, // Correct relative path
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative z-10 text-center mt-40 text-white px-4">
                <Typography className="text-5xl md:text-6xl text-white font-bold leading-tight">
                    Agents. Tours. Loans. Homes.
                </Typography>

                {/* Search Box */}
                <div className="mt-6 mx-auto w-full max-w-xl">
                    <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md">
                        <input
                            type="text"
                            placeholder="Enter an address, neighborhood, city, or ZIP code"
                            className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
                        />
                        <button className="p-3 bg-blue-500 text-white rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 6.65a7.5 7.5 0 004.35 4.35z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

