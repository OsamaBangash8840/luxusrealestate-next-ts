'use client'

import { Card, CardContent } from "../../shadcn/card";

interface CardProps {
    className ?: string;
    children ?: React.ReactNode;
    onClick ?: ()=>void;
}

export const Cards:React.FC<CardProps>=({
    className,
    children,
    onClick
})=>{
    return (
        <Card>
            <CardContent className={className} onClick={onClick}>
                {children}
            </CardContent>
        </Card>
    )
}