import React, { useEffect } from 'react';
import { api } from '@plug/api-hooks/core';
import useStationStore from '@plug/v1/app/stores/stationStore';
import useSideMenuStore from '@plug/v1/app/stores/sideMenuStore';
import MenuItem from './MenuItem';
import DevicePanel from './DevicePanel';
import { Tooltip } from '@plug/ui';

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

const SideMenu: React.FC = () => {
  const { 
    activeMenu, 
    menuItems, 
    isDevicePanelOpen, 
    setActiveMenu, 
    setMenuItems, 
    setIsDevicePanelOpen 
  } = useSideMenuStore();

  const { stationCode } = useStationStore();
  useEffect(() => {
    const fetchCategory = async () => {

      if (!stationCode) {
        console.log("No stationId available, skipping fetch");
        return;
      }
      
      try {
        console.log('Fetching categories for station:', stationCode);
        const response = await api.get<Category[]>(`devices/station/${stationCode}/grouped`);
        if (response.data) {
          const transformedMenuItems = response.data.map(item => ({
            id: item.categoryId.toString(),
            name: item.categoryName,
            type: item.contextPath.replace(/\//g, ''),
            icon: item.iconFile?.url,
            devices: item.devices || []
          }));
          console.log('Setting menuItems:', transformedMenuItems);
          setMenuItems(transformedMenuItems);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();  }, [stationCode, setMenuItems]);
  const handleMenuItemClick = (id: string) => {
    const clickedMenu = menuItems.find(item => item.id === id) || null;
    const newActive = activeMenu?.id === id ? null : clickedMenu;
    setActiveMenu(newActive);
    setIsDevicePanelOpen(newActive !== null);
  };

  return (
    <>
      <div className="fixed left-0 top-16 bottom-0 w-16 bg-gradient-to-b from-primary-900/30 to-primary-900/20 backdrop-blur-md flex flex-col items-center pt-4 px-2 z-30 shadow-xl border-r border-primary-100/5">
        <div className="flex-1 mt-2 space-y-3">
          {menuItems.map((item) => (
            <Tooltip key={item.id} position="right" trigger="hover" className="z-50 block">
              <Tooltip.Trigger className="w-full">
                <MenuItem
                  id={item.id}
                  icon={item.icon}
                  isActive={activeMenu?.id === item.id}
                  onClick={handleMenuItemClick}
                />
              </Tooltip.Trigger>
              <Tooltip.Content className="bg-[#10385E] text-white backdrop-blur-md rounded-lg shadow-2xl px-4 py-2 text-sm font-medium after:bg-none after:content-none border border-primary-400/30">
                {item.name}
              </Tooltip.Content>
            </Tooltip>
          ))}
        </div>
      </div>
      {isDevicePanelOpen && activeMenu && (
        <DevicePanel
          categoryId={activeMenu.id}
          categoryName={activeMenu.name}
          categoryType={activeMenu.type}
          devices={activeMenu.devices}          onClose={() => {
            setActiveMenu(null);
            setIsDevicePanelOpen(false);
          }}
        />
      )}
    </>
  );
};

export default SideMenu;
