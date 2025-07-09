export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  to?: string;
  depth: 1 | 2;
  parentId?: string;
  showToggle?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeItemId: string | null;
  expandedItemIds: string[];
  onItemClick: (id: string) => void;
  onToggleExpand: (id: string) => void;
}
