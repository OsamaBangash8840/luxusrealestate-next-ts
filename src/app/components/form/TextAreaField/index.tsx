import React , {TextareaHTMLAttributes} from "react";
import { Typography } from "../../common";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    placeholder: string;
    className?: string;
    icon?: React.ReactNode;
    inputClass?: string;
    rows ?: number;
}

export const TextAreaField = ({
    label,
    placeholder,
    className,
    icon = null,
    inputClass,
    rows = 5,
    ...rest
}:Props) : React.ReactElement => (
    <div className={`${className}`}>
        {typeof label !== 'undefined' && (
            <Typography className="block mb-1.5">{label}</Typography>
        )}
        <div className="relative w-full">
            {icon !== null && (
                <span className="text-secondary opacity-40 text-lg md:text-xl absolute left-5 top-1/2 -translate-y-1/2">
                    {icon}
                </span>
            )}
             <textarea
                rows={rows}
                placeholder={placeholder}
                className={`w-full placeholder:text-secondary/30 bg-boxColorDark text-secondary py-3 sm:py-4 rounded-2xl shadow-lg outline-none border border-dashed border-newLinear  shadow-newLinear border-boxOutline focus:border-primary bg-bgBox bg-opacity-80 text-sm sm:text-base resize-none ${icon !== null ? 'pr-6 pl-[54px]' : 'px-6'}`}
                {...rest}
            />
        </div> 
     </div>
)