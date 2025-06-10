
interface MenuItemProps {
  id: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (id: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  id, 
  icon, 
  isActive,
  onClick
}) => {

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick?.(id);
    }
    
    return (
    <div className="mb-1 border border-white/50 rounded-md cursor-pointer user-select-none">
      <button 
        onClick={handleClick}
        className={`text-white flex cursor-pointer
          w-full py-3 px-2 hover:bg-indigo-800 rounded-md transition-colors duration-200 ease-in-out
          ${isActive ? 'bg-indigo-800' : ''}`}
      >
        <div className={`bg-opacity-10 rounded-md flex items-center justify-center flex-shrink-0`}>
          <img 
            src={icon as string} 
            alt="Menu Icon" 
            className="w-8 h-8"
          />
        </div>
      </button>
    </div>
  );
};

export default MenuItem;