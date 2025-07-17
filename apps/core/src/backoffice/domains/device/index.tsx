import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@plug/ui'
import { PageContainer } from '@/backoffice/common/view/layouts'

const Device: React.FC = () => {
  return (
    <PageContainer title="Device">
      <Card>
        <CardHeader>
          <CardTitle>Device</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">System Device</h3>
            <p className="text-gray-600">Device Contents</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

export default Device
