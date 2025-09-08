import { BackofficeHeader } from '@/backoffice/common/view/layouts';

import React from 'react';
import { Outlet } from 'react-router-dom';

import { Toast } from '@plug/ui';
const BackofficeLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <BackofficeHeader />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      <Toast />
    </div>
  );
};

export default BackofficeLayout;
