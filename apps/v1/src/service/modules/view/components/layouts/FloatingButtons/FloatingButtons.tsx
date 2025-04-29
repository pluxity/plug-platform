const FloatingButtons = () => {
    return (
        <div className="absolute top-1/4 right-6 flex flex-col gap-2 bg-red-500">
            <button className="w-10 h-10 rounded-full bg-white shadow">1F</button>
            <button className="w-10 h-10 rounded-full bg-white shadow">2F</button>
            <button className="w-10 h-10 rounded-full bg-white shadow">3D</button>
        </div>
    );
};

export default FloatingButtons;
