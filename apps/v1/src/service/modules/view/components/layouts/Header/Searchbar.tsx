const SearchBar = () => {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder="장비명 검색"
                className="pl-10 pr-4 py-1 rounded-md bg-white text-sm text-black placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-2 top-1.5 text-gray-500">
        🔍
      </span>
        </div>
    );
};

export default SearchBar;
