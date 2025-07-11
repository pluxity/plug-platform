import React from 'react'
import { Card, CardContent, Badge } from '@plug/ui'
import { SystemStatus } from '@/app/model/types/MapTypes'

interface StatusPanelProps {
  systemStatus: SystemStatus
}

const StatusPanel: React.FC<StatusPanelProps> = ({ systemStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'offline': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600'
    if (health >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="absolute bottom-20 left-4 right-4">
      <Card className="bg-white bg-opacity-90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">{systemStatus.activePoints}</div>
              <div className="text-xs text-gray-600">Active Points</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${getHealthColor(systemStatus.systemHealth)}`}>
                {systemStatus.systemHealth}%
              </div>
              <div className="text-xs text-gray-600">System Health</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {systemStatus.connectedUsers.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Connected Users</div>
            </div>
            <div>
              <Badge className={getStatusColor(systemStatus.dataStreamStatus)}>
                {systemStatus.dataStreamStatus.toUpperCase()}
              </Badge>
              <div className="text-xs text-gray-600 mt-1">Data Stream</div>
            </div>
          </div>
          <div className="text-center mt-3">
            <div className="text-xs text-gray-500">
              Last Updated: {systemStatus.lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatusPanel
