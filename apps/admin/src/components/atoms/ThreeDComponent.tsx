import { useEffect, useRef } from "react";

const ThreeDComponent = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        console.log("initail");
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full bg-red-500">

        </div>
    )
}

export default ThreeDComponent;