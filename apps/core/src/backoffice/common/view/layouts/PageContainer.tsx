import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "@plug/ui";
import { PageContainerProps } from '@/backoffice/common/services/types/layout'

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate('/admin/facility')
  }

  return (
    <div className="space-y-6 h-full">
      <div className="border-b pb-6 mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-secondary-foreground ">
          {title}
        </h2>
        {window.location.pathname.endsWith("indoor") && (
          <Button variant="ghost" onClick={handleGoBack}>
            목록으로
          </Button>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export default PageContainer
