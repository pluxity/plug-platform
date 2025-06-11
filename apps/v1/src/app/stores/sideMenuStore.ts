import { create } from 'zustand';

interface DeviceData {
  id: string;
  name: string;
  code: string;
  feature: {
    id: string;
    floorId: string;
    assetId: string;
  };
}

interface MenuItemData {
  id: string;
  name: string;
  type: string;
  icon: string;
  devices: DeviceData[];
}

interface SideMenuState {
  activeMenu: MenuItemData | null;
  menuItems: MenuItemData[];
  isDevicePanelOpen: boolean;
  setActiveMenu: (menu: MenuItemData | null) => void;
  setMenuItems: (items: MenuItemData[]) => void;
  setIsDevicePanelOpen: (isOpen: boolean) => void;
  openMenuByDeviceId: (deviceId: string) => void;
  closeDevicePanel: () => void;
}

const useSideMenuStore = create<SideMenuState>((set, get) => ({
  activeMenu: null,
  menuItems: [],
  isDevicePanelOpen: false,
  
  setActiveMenu: (menu) => set({ activeMenu: menu }),
  setMenuItems: (items) => set({ menuItems: items }),
  setIsDevicePanelOpen: (isOpen) => set({ isDevicePanelOpen: isOpen }),
  
  openMenuByDeviceId: (deviceId) => {
    const { menuItems } = get();
    
    console.log('openMenuByDeviceId 호출됨:', deviceId, '(타입:', typeof deviceId, ')');
    console.log('현재 menuItems:', menuItems);
    
    // deviceId가 속한 카테고리 찾기 (문자열과 숫자 모두 고려)
    const targetMenu = menuItems.find(menu => 
      menu.devices.some(device => {
        const deviceIdMatch = device.id === deviceId || device.id === String(deviceId) || String(device.id) === String(deviceId);
        console.log('비교:', device.id, '(타입:', typeof device.id, ') === ', deviceId, '(타입:', typeof deviceId, ') ?', deviceIdMatch);
        return deviceIdMatch;
      })
    );
    
    console.log('찾은 targetMenu:', targetMenu);
    
    if (targetMenu) {
      console.log('메뉴 열기:', targetMenu.name);
      set({ 
        activeMenu: targetMenu,
        isDevicePanelOpen: true 
      });
    } else {
      console.log('해당 deviceId를 가진 카테고리를 찾을 수 없습니다.');
    }
  },
  
  closeDevicePanel: () => set({ 
    activeMenu: null, 
    isDevicePanelOpen: false 
  }),
}));

export default useSideMenuStore;
