import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@plug/ui'
import { MapMarker } from '@/app/model/types/MapTypes'

interface MarkerListProps {
  markers: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  onMarkerStatusChange?: (id: string, status: MapMarker['status']) => void
  onRemoveMarker?: (id: string) => void
}

const MarkerList: React.FC<MarkerListProps> = ({
  markers,
  onMarkerClick,
  onMarkerStatusChange,
  onRemoveMarker
}) => {
  const getTypeIcon = (type: MapMarker['type']) => {
    switch (type) {
      case 'poi': return '📍'
      case 'station': return '🚇'
      case 'checkpoint': return '🎯'
      case 'warning': return '⚠️'
      default: return '📌'
    }
  }

  const getStatusColor = (status: MapMarker['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (markers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Markers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">📍</div>
            <p>No markers found</p>
            <p className="text-sm">Add some markers to see them here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Markers ({markers.length})
          <Badge variant="secondary">{markers.filter(m => m.status === 'active').length} Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onMarkerClick?.(marker)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-xl">{getTypeIcon(marker.type)}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{marker.title}</h4>
                    <p className="text-xs text-gray-600">
                      {marker.position.lat.toFixed(4)}, {marker.position.lng.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{marker.type}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getStatusColor(marker.status)}>
                    {marker.status}
                  </Badge>
                  <div className="flex space-x-1">
                    {onMarkerStatusChange && (
                      <select
                        className="text-xs border rounded px-1 py-1"
                        value={marker.status}
                        onChange={(e) => onMarkerStatusChange(marker.id, e.target.value as MapMarker['status'])}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="active">Active</option>
                        <option value="warning">Warning</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    )}
                    {onRemoveMarker && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveMarker(marker.id)
                        }}
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default MarkerList
