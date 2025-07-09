import { useNavigate } from "react-router-dom";
import { cn } from "../../../utils/utils";
import FoldIcon from "../../../assets/icons/sidebar/fold.svg";
import UnfoldIcon from "../../../assets/icons/sidebar/unfold.svg";
import DepthIcon from "../../../assets/icons/sidebar/2depth.svg";
import { SidebarItem, SidebarProps } from "./Sidebar.types";

const activeColor = 'invert(23%) sepia(98%) saturate(6209%) hue-rotate(212deg) brightness(97%) contrast(101%)';
const inactiveColor = 'invert(47%) sepia(16%) saturate(268%) hue-rotate(174deg) brightness(94%) contrast(87%)';

function Sidebar({ items, activeItemId, expandedItemIds, onItemClick, onToggleExpand }: SidebarProps) {
  const navigate = useNavigate();

  const getItemById = (id: string) => items.find(item => item.id === id);
  const isItemExpanded = (id: string) => expandedItemIds.includes(id);

  const renderItem = (item: SidebarItem) => {
    const { id, label, icon, to, depth, showToggle } = item;
    const isActive = id === activeItemId;
    const isExpanded = isItemExpanded(id);

    if (depth === 2 && item.parentId) {
      const parent = getItemById(item.parentId);
      if (!parent || !isItemExpanded(parent.id)) return null;
    }

    return (
      <div
        key={id}
        className={cn(
          "self-stretch inline-flex justify-start items-center gap-1.5 cursor-pointer",
          depth === 1 ? "pl-1.5 py-1.5" : "pl-2.5 py-1.5 h-7",
          isActive ? "bg-blue-50" : "bg-white",
          "rounded-[3px] hover:bg-blue-50"
        )}
        onClick={() => { onItemClick(id); if (to) navigate(to);}}
      >
        <div
          className="rounded-sm flex justify-center items-center gap-2.5"
          {...(showToggle && {
            onClick: (e) => {
              e.stopPropagation();
              onToggleExpand(id);
            },
          })}
        >
          {showToggle ? (
            isExpanded ? (
              <div className="w-[12px] h-[12px]" style={{ filter: isActive ? activeColor : inactiveColor }}>
                <UnfoldIcon />
              </div>

            ) : (
              <div className="w-[12px] h-[12px]" style={{ filter: isActive ? activeColor : inactiveColor }}>
                <FoldIcon  />
              </div>
            )
          ) : depth === 2 ? (
            <div className="w-[12px] h-[12px]" style={{ filter: isActive ? activeColor : inactiveColor }}>
              <DepthIcon />
            </div>
          ) : (
            <img
              src={icon}
              alt="icon"
              width={12}
              height={12}
              style={{ filter: isActive ? activeColor : inactiveColor }}
            />
          )}
          <div className={`text-center justify-start text-sm ${depth === 1 ? 'font-bold' : ''} ${isActive ? 'text-[#0066FF]' : 'text-[#6B7482]'} hover:text-[#0066FF]`}>
            {label}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 h-screen p-5 bg-white border-r border-slate-200 overflow-hidden">
      <div className="w-full flex flex-col justify-start items-start gap-1.5">
        {items.map(renderItem)}
      </div>
    </div>
  );
}

Sidebar.displayName = "Sidebar";

export { Sidebar };
