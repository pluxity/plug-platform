const Sidebar = () => {
    return (
        <aside className="w-72 h-full bg-blue-500 overflow-y-auto p-4">
            <div className="font-semibold mb-4">메뉴</div>
            <ul>
                <li>역 보기</li>
                <li>시설 보기</li>
                <li>알람 보기</li>
            </ul>
        </aside>
    );
};

export default Sidebar;
