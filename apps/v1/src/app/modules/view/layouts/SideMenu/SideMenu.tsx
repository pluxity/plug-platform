import React, { useEffect, useState } from 'react';
import { api } from '@plug/api-hooks/core';
import useStationStore from '@plug/v1/app/stores/stationStore';
import MenuItem from './MenuItem';
import DevicePanel from './DevicePanel';

interface DeviceData {
  id: string;
  name: string;
  code: string;
  feature: DeviceFeature;
}

interface DeviceFeature {
  id: string;
  floorId: string;
  assetId: string;
}

interface Category{
  categoryId: string;
  categoryName: string;
  contextPath: string;
  iconFile: {url: string;};
  devices: DeviceData[];
}

interface MenuItemData {
  id: string;
  name: string;
  type: string;
  icon: string;
  devices: DeviceData[];
}

const SideMenu: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuItemData | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [isDevicePanelOpen, setIsDevicePanelOpen] = useState<boolean>(false);

  const { facilityCode } = useStationStore(); 

  useEffect(() => {
    const fetchCategory = async () => {

      if (!facilityCode) {
        console.log("No stationId available, skipping fetch");
        return;
      }
      
      try {
        const response = await api.get<Category[]>(`devices/station/${facilityCode}/grouped`);
        if (response.data) {
          const transformedMenuItems = response.data.map(item => ({
            id: item.categoryId.toString(),
            name: item.categoryName,
            type: item.contextPath.replace(/\//g, ''),
            icon: item.iconFile?.url,
            devices: item.devices || []
          }));
          setMenuItems(transformedMenuItems);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, [facilityCode]);

  const handleMenuItemClick = (id: string) => {
    const clickedMenu = menuItems.find(item => item.id === id) || null;
    setActiveMenu(prev => {
      const newActive = prev?.id === id ? null : clickedMenu;
      setIsDevicePanelOpen(newActive !== null);
      return newActive;
    });
  };

  const closeDevicePanel = () => {
    setActiveMenu(null);
    setIsDevicePanelOpen(false);
  };

  return (
    <>
      <div className={`fixed left-0 top-16 bottom-0 w-16 bg-primary-400/20 backdrop-blur-xs flex flex-col items-center pt-4 px-2 z-10`}>
        <div className="overflow-y-auto flex-1 mt-2">        
          {menuItems.map((item) => (
             <MenuItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              isActive={activeMenu?.id === item.id}
              onClick={handleMenuItemClick}
           />
          ))}
        </div>
      </div>      {isDevicePanelOpen && activeMenu && (
        <DevicePanel 
          categoryId={activeMenu.id} 
          categoryName={activeMenu.name} 
          categoryType={activeMenu.type}
          devices={activeMenu.devices}
          onClose={closeDevicePanel} 
        />
      )}
    </>
  );
};

export default SideMenu;
