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
                className={`w-full placeholder:text-secondary/50 bg-background text-foreground py-3 sm:py-4 rounded-none outline-none border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm sm:text-base resize-none transition-colors ${icon !== null ? 'pr-6 pl-[54px]' : 'px-6'} ${inputClass || ''}`}
                {...rest}
            />
        </div> 
     </div>
)