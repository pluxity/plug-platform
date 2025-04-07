import React from 'react';
import { MapTemplate } from '../components/templates/MapTemplate';
import useAuthStore from '../stores/authStore';

const HomePage: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <MapTemplate 
      title="부산 지하철" 
      onLogout={logout}
    />
  );
};

export default HomePage; 