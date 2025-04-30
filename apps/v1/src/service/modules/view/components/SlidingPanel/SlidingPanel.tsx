import React from 'react';
import {cn} from "@plug/ui";

interface SlidingPanelProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const SlidingPanel = ({ isOpen, onClose, children }: SlidingPanelProps) => {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={onClose}
                />
            )}
            <aside
                className={cn(
                    'fixed top-[10%] left-24 h-[657px] w-[320px] bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+6rem)]'
                )}
            >
                <div className="p-4 font-bold flex justify-between items-center">
                    장비목록
                    <button onClick={onClose}>닫기</button>
                </div>
                <div className="p-4 overflow-y-auto h-full">{children}</div>
            </aside>
        </>
    );
};

export default SlidingPanel;
