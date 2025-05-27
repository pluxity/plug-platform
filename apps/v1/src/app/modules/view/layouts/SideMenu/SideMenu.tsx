import React, { useState } from 'react';

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
  return (
    <div className="mb-1">
      <button 
        onClick={() => onClick(id)}
        className={`text-white flex 
          w-full py-3 px-2 hover:bg-indigo-800 rounded-md transition-colors duration-200 ease-in-out
          ${isActive ? 'bg-indigo-800' : ''}`}
      >
        <div className={`bg-white bg-opacity-10 rounded-md flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </button>
    </div>
  );
};

const SideMenu: React.FC = () => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleMenuItemClick = (id: string) => {
    // Toggle active menu item
    setActiveMenuId(prev => prev === id ? null : id);
  };
  const menuItems = [
    {
      id: 'cctv',
      text: 'CCTV',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          <path d="M14 6a2 2 0 00-2 2v8a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2z" />
        </svg>
      )
    },    {
      id: 'shutter',
      text: '셔터',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    },    {
      id: 'fire',
      text: '화재수신기',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      )
    },    {
      id: 'elevator',
      text: '승강설비',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1v1.5A1.5 1.5 0 0115 13a1.5 1.5 0 01-1.5-1.5V10h-1.5A1.5 1.5 0 0110 8.5v-1A1.5 1.5 0 0111.5 6H13V5a1 1 0 00-1-1h-2a1 1 0 000 2H9a1 1 0 001 1v1.5A1.5 1.5 0 018.5 10 1.5 1.5 0 017 8.5V7H5a1 1 0 001-1V5a1 1 0 00-1-1h-3a1 1 0 00-1 1v3a1 1 0 001 1h1v1.5A1.5 1.5 0 005 13a1.5 1.5 0 001.5-1.5V10h1.5A1.5 1.5 0 0010 8.5v-5z" />
        </svg>
      )
    },    {
      id: 'purifier',
      text: '공기청정기',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
        </svg>
      )
    },    {
      id: 'lighting',
      text: '조명',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
      )
    },    {
      id: 'ventilation',
      text: '환기설비',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      )
    },    {
      id: 'water',
      text: '물탱크/집수정',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'psd',
      text: 'PSD',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <div className={`fixed left-0 top-16 bottom-0 w-16 bg-primary-400/20 flex flex-col items-center pt-4 px-2 z-10 shadow-lg`}>      
      <div className="overflow-y-auto flex-1 mt-2">        
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            isActive={activeMenuId === item.id}
            onClick={handleMenuItemClick}
          />
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
