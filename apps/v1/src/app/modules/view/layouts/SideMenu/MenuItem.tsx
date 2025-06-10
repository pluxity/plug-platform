
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
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group flex items-center justify-center w-12 h-12 rounded-lg border transition-all duration-200 
        ${isActive ? 'bg-primary-900/90 shadow-md border-primary-700/20' : 'bg-primary-300/10 border-none hover:bg-primary-300/30'}
      `}
    >
      <img
        src={icon as string}
        alt="Menu Icon"
        className={`
          w-6 h-6 transition-transform duration-200
          brightness-150
          ${isActive ? 'scale-110 brightness-200' : 'opacity-80 group-hover:opacity-100'}
        `}
      />
    </button>
  );
};

export default MenuItem;