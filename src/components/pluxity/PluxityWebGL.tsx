'use client';

import { useEffect, useRef } from "react";
import * as Px from "@/libs/PluxityViewer.module";

export default function PluxityWebGL() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(containerRef.current) {
            Px.Core.Initialize(containerRef.current);
        } else {
            console.error("containerRef.current가 null입니다.");
        }
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full">

        </div>
    );
}
