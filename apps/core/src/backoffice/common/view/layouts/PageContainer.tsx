import React from 'react'

import { PageContainerProps } from '@/backoffice/common/services/types/layout'

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-secondary-foreground border-b pb-6 mb-6">{title}</h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}

export default PageContainer
