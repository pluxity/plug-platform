const Sidebar = () => {
    return (
        <aside className="absolute top-1/4 h-96 left-0 w-20 bg-blue-500 opacity-80 text-white z-10 p-4 flex flex-col items-center">
            <div className="font-semibold mb-4">메뉴</div>
            <ul className="flex flex-col gap-2">
                <li>역</li>
                <li>시설</li>
                <li>알람</li>
            </ul>
        </aside>
    );
};

export default Sidebar;
