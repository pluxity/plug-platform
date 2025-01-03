'use client'

import Button from "@/components/atoms/buttons";
import sample from "../../../../public/icons/sample.svg";
import Image from "next/image";
import Badge from "@/components/atoms/badge";
import badgeStore from "@/store/badge-store";
import { useEffect } from "react";

const Nav = () => {

    const setUnreadCount = badgeStore((state) => state.setUnreadCount);

    useEffect(() => {
        setUnreadCount(10);
    }, [setUnreadCount]);

    return (
        <nav className="fixed w-full pt-4 text-2xl bg-transparent flex justify-center text-violet-50">
            <p>플럭시티 관제 플랫폼</p>
            <Badge >
                <Button variant="icon" size="small" color="secondary" onClick={() => { setUnreadCount(0); }}>
                    <Image priority src={sample} alt="sample"></Image>
                </Button>
            </Badge>
            <Button variant="text" size="medium" color="primary">
                Text Button
            </Button>
            <Button variant="outlined" size="large" color="primary">
                 <span>
                    <Image priority src={sample} alt="sample"/> 
                </span> Launch
            </Button>
        </nav>
    )
}

export default Nav;