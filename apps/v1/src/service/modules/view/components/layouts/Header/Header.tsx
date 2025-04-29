import SearchBar from "@plug/v1/service/modules/view/components/layouts/Header/Searchbar";
import UserProfile from "@plug/v1/service/modules/view/components/layouts/Header/UserProfile";

const Header = () => {
    return (
        <header className="absolute top-0 left-0 w-full h-16 px-6 flex items-center justify-between bg-black/60 text-white z-10">
            <div className="text-lg font-bold">부산 사상 교통공사</div>
            <div className="flex items-center gap-4">
                <SearchBar/>
                <UserProfile/>
            </div>
        </header>
    );
};

export default Header;
