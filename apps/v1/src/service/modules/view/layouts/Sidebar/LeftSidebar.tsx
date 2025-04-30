import React, { useState } from 'react';
import SlidingPanel from '../../components/SlidingPanel/SlidingPanel';
import {Button} from "@plug/ui";

const LeftSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <aside className="absolute top-1/4 h-96 left-0 w-20 bg-blue-500 opacity-80 text-white z-10 p-4 flex flex-col items-center">
                <div className="font-semibold mb-4">메뉴</div>
                <ul className="flex flex-col gap-2">
                    <li>
                        <Button onClick={() => setIsOpen(true)}>역</Button>
                    </li>
                    <li>시설</li>
                    <li>알람</li>
                </ul>
            </aside>

            <SlidingPanel isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ul className="space-y-2">
                    <li>역사카메라</li>
                    <li>PSD</li>
                    <li>소방설비</li>
                    <li>기계설비</li>
                </ul>
            </SlidingPanel>
        </>
    );
};

export default LeftSidebar;
