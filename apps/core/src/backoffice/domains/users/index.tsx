import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@plug/ui'

const Users: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">User management functionality will be implemented here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Users
