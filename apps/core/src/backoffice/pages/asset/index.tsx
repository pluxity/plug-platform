import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@plug/ui'
import { PageContainer } from '../../common/view/components'

const Asset: React.FC = () => {
  return (
    <PageContainer title="Asset">
      <Card>
        <CardHeader>
          <CardTitle>Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">System Asset</h3>
            <p className="text-gray-600">System settings functionality will be implemented here.</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

export default Asset
