'use client'

import { Card, CardContent } from "../../shadcn/card";

interface CardProps {
    className ?: string;
    children ?: React.ReactNode;
}

export const Cards:React.FC<CardProps>=({
    className,
    children
})=>{
    return (
        <Card>
            <CardContent className={className}>
                {children}
            </CardContent>
        </Card>
    )
}