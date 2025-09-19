import { BackofficeHeader } from '@/backoffice/common/view/layouts';

import React from 'react';
import { Outlet } from 'react-router-dom';

import { Toast } from '@plug/ui';
const BackofficeLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <BackofficeHeader />
      <main className="flex-1 overflow-hidden bg-white">
        <Outlet />
      </main>
      <Toast />
    </div>
  );
};

export default BackofficeLayout;
