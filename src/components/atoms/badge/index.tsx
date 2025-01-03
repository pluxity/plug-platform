'use client'

import React, { ReactNode } from "react";
import useBadgeStore from "@/store/badge-store";


interface BadgeProps {
    children: ReactNode;
    position?:  "lt" | "ct" | "rt" |
                "lm" | "cm" | "rm" |
                "lb" | "cb" | "rb" ;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    position = "rt",
}) => {

    const positionStyle: string = {
        lt: "left-0 top-0",
        ct: "left-1/2 top-0",
        rt: "right-0 top-0",
        lm: "left-0 top-1/2",
        cm: "left-1/2 top-1/2",
        rm: "right-0 top-1/2",
        lb: "left-0 bottom-0",
        cb: "left-1/2 bottom-0",
        rb: "right-0 bottom-0",
    }[position];

    const unreadCount = useBadgeStore((state) => state.unreadCount);

    return (
        <div className="relative inline-block">
            {children}
            {unreadCount > 0 && (
                <span
                    className={`absolute ${positionStyle} bg-red-500 text-white text-xs px-2 py-1 rounded-full`}
                >
                    {unreadCount}
                </span>
            )}
        </div>
    );
};
export default Badge;