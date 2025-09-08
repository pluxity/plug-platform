import { useNavigate } from "react-router-dom";
import { cn } from "../../../utils/utils";
import { SidebarItem, SidebarProps } from "./Sidebar.types";
import {
  FirstDepthIcon,
  SecondDepthIcon,
} from "../../../assets/icons/sidebar/Icons";

const Sidebar = ({
                   items,
                   activeItemId,
                   expandedItems,
                   onItemClick,
                 }: SidebarProps) => {
  const navigate = useNavigate();

  const handleItemClick = (item: SidebarItem) => {
    onItemClick(item.id);

    if (item.to) {
      navigate(item.to);
    }
  };

  const renderItems = (parentId?: string) => {
    return items
      .filter(item => {
        if (parentId) {
          return item.parentId === parentId;
        }
        return item.depth === 1;
      })
      .map(item => {
        const isActive = item.id === activeItemId;
        const isExpanded = expandedItems.includes(item.id);
        const hasChildren = items.some(i => i.parentId === item.id);

        return (
          <div key={item.id}>
            <button
              type="button"
              className={cn(
                "w-full text-left",
                "flex items-center",
                "transition-all duration-300 ease-in-out",
                item.depth === 1 ? "h-10" : "h-7",
                item.depth === 2 && "ml-8",
                isActive
                  ? "bg-primary-50 text-primary-900"
                  : "text-[#6B7482] hover:bg-primary-50/50",
                "rounded-[3px]",
              )}
              onClick={() => handleItemClick(item)}
            >
              {isActive && (
                <div className="w-1 h-full bg-primary-600 rounded-r-sm mr-3 transition-all duration-300" />
              )}

              <div className="flex items-center gap-2.5 px-4">
                {item.depth === 1 ? (
                  <FirstDepthIcon
                    className={cn(
                      "w-5 h-5 transition-colors duration-300",
                      isActive ? "text-primary-600" : "text-secondary-600"
                    )}
                  />
                ) : (
                  <SecondDepthIcon
                    className={cn(
                      "w-4 h-4 transition-colors duration-300",
                      isActive ? "text-primary-600" : "text-secondary-600"
                    )}
                  />
                )}

                <span className={cn(
                  "text-sm transition-colors duration-300",
                  item.depth === 1 && "font-bold",
                  isActive ? "text-primary-900" : "text-[#6B7482]",
                )}>
                {item.label}
              </span>
              </div>
            </button>

            {hasChildren && isExpanded && (
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {renderItems(item.id)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <nav
      className="w-56 h-screen py-5 bg-secondary-200/50 border-r border-slate-200 overflow-hidden shadow-[1px_0_2px_rgba(0,0,0,0.05)]"
      aria-label="사이드바 네비게이션"
    >
      <div className="w-full flex flex-col gap-1.5">
        {renderItems()}
      </div>
    </nav>
  );
};


export { Sidebar };