export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  to?: string;
  depth: 1 | 2;
  parentId?: string;
  showToggle?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeItemId: string | null;
  expandedItems: string[];
  onItemClick: (id: string) => void;
}
