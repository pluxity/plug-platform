'use client';

import { useEffect, useRef } from "react";
import * as Px from "@/libs/PluxityViewer.module";

export default function PluxityWebGL() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Px.Core.Initialize(containerRef.current);
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full">

        </div>
    );
}
