import React, { useEffect, useState } from 'react';
import { api } from '@plug/api-hooks/core';
// import type { FileResponse } from '@plug/common-services/types';
import useStationStore from '@plug/v1/app/stores/stationStore';
// import MenuItem from './MenuItem';
import DevicePanel from './DevicePanel';

// interface Category {
//   id: number;
//   name: string;
//   parentId: number | null;
//   iconFile: FileResponse;
// }

// interface MenuItemData {
//   id: string;
//   icon: string;
//   name: string;
// }

const SideMenu: React.FC = () => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  // const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [isDevicePanelOpen, setIsDevicePanelOpen] = useState<boolean>(false);

  const { stationId } = useStationStore(); 

  useEffect(() => {
    const fetchCategory = async () => {

      if (!stationId) {
        console.log("No stationId available, skipping fetch");
        return;
      }
      
      try {
        const response = await api.get(`devices/station/${stationId}/grouped`);
        console.log("Fetched categories:", response.data);

        // FIXME : API 변경에 따라 로직 수정

        if (response.data) {
          // const transformedMenuItems = response.data.map(category => ({
          //   id: category.id.toString(),
          //   icon: category.iconFile.url, 
          //   name: category.name,
          // }));
          // setMenuItems(transformedMenuItems);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, [stationId]);

  // const handleMenuItemClick = (id: string) => {
  //   setActiveMenuId(prev => {
  //     const newActiveId = prev === id ? null : id;
  //     setIsDevicePanelOpen(newActiveId !== null); // Open panel if a menu item is active
  //     return newActiveId;
  //   });
  // };

  const closeDevicePanel = () => {
    setActiveMenuId(null);
    setIsDevicePanelOpen(false);
  };

  return (
    <>
      <div className={`fixed left-0 top-16 bottom-0 w-16 bg-primary-400/20 backdrop-blur-xs flex flex-col items-center pt-4 px-2 z-10`}>
        <div className="overflow-y-auto flex-1 mt-2">        
          {/* {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              isActive={activeMenuId === item.id}
              onClick={handleMenuItemClick}
            />
          ))} */}
        </div>
      </div>
      {isDevicePanelOpen && activeMenuId && (
        <DevicePanel categoryId={activeMenuId} onClose={closeDevicePanel} />
      )}
    </>
  );
};

export default SideMenu;
