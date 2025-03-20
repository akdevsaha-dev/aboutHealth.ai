"use client"

import React from "react"

type SeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export const Separator: React.FC<SeparatorProps> = ({ className = "", ...props }) => {
    return (
        <div
            className={`h-px w-full bg-gray-700 ${className}`}
            {...props}
        />
    )
}