import { useNavigate } from "react-router-dom";
import { cn } from "../../../utils/utils";
import { SidebarProps } from "./Sidebar.types";
import { SecondDepthIcon } from "../../../assets/icons/sidebar/Icons";

const Sidebar = ({
                   items,
                   activeItemId,
                   expandedItemIds,
                   onToggleExpand,
                 }: SidebarProps) => {
  const navigate = useNavigate();

  const renderItems = (parentId?: string) =>
    items
      .filter((item) => (parentId ? item.parentId === parentId : item.depth === 1))
      .map((item) => {
        const isActive = item.id === activeItemId;
        const isExpanded = expandedItemIds.includes(item.id);
        const hasChildren = items.some((i) => i.parentId === item.id);

        const handleRowClick = () => {
          if (hasChildren) {
            onToggleExpand?.(item.id);
          } else if (item.to) {
            navigate(item.to);
          }
        };

        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={handleRowClick}
              aria-expanded={hasChildren ? isExpanded : undefined}
              className={cn(
                "w-full text-left flex items-center transition-all duration-300 ease-in-out rounded-[3px]",
                item.depth === 1 ? "h-10" : "h-7",
                item.depth === 2 && "ml-8",
                hasChildren
                  ? "text-[#6B7482] hover:bg-primary-50/50"
                  : isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-[#6B7482] hover:bg-primary-50/50",
              )}
            >
              {!hasChildren && isActive && (
                <div className="w-1 h-full bg-primary-700 rounded-r-sm mr-3 transition-all duration-300 animate-fadeIn" />
              )}

              <div
                className={cn(
                  "flex items-center gap-2.5 px-4 transition-all duration-200",
                  !hasChildren && isActive && "translate-x-1"
                )}
              >
                {item.depth === 1 ? item.icon : (
                  <SecondDepthIcon className={cn(
                    "transition-all duration-300",
                    !hasChildren && isActive ? "text-primary-700" : "text-secondary-600"
                  )} />
                )}

                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    item.depth === 1 && "font-bold",
                    !hasChildren && isActive ? "text-primary-900" : "text-[#6B7482]"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </button>

            {hasChildren && (
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isExpanded ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
                )}
              >
                {renderItems(item.id)}
              </div>
            )}
          </div>
        );
      });

  return (
    <nav className="w-56 py-5 bg-secondary-200/50 border-r border-slate-200 overflow-hidden shadow-[1px_0_2px_rgba(0,0,0,0.05)]" aria-label="사이드바 네비게이션">
      <div className="w-full flex flex-col gap-1.5">{renderItems()}</div>
    </nav>
  );
};

Sidebar.displayName = "Sidebar";
export { Sidebar };
