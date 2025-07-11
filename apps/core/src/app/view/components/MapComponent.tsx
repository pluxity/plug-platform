import React from 'react'
import { Card, CardContent, Button } from '@plug/ui'
import { MapState } from '@/app/model/types/MapTypes'

interface MapComponentProps {
  mapState: MapState
  onCenterMap: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onAddMarker: () => void
  onSearchLocation: (query: string) => void
}

const MapComponent: React.FC<MapComponentProps> = ({
  mapState,
  onCenterMap,
  onZoomIn,
  onZoomOut,
  onAddMarker,
  onSearchLocation
}) => {
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchLocation(searchQuery.trim())
      setSearchQuery('')
    }
  }

  return (
    <div className="h-full relative">
      {/* Map Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
        {/* Map Center Display */}
        <div className="h-full flex items-center justify-center">
          <Card className="bg-white bg-opacity-90 backdrop-blur-sm max-w-md">
            <CardContent className="text-center space-y-4 p-6">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-2">Interactive Map View</h3>
              <p className="text-gray-600 mb-4">
                Center: {mapState.center.lat.toFixed(4)}, {mapState.center.lng.toFixed(4)}
              </p>
              <p className="text-gray-600 mb-4">
                Zoom Level: {mapState.zoom} | Markers: {mapState.markers.length}
              </p>
              
              {/* Search */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="도시명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <Button onClick={handleSearch} size="sm">
                  🔍
                </Button>
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={onCenterMap}>
                  🎯 Center
                </Button>
                <Button variant="outline" onClick={onAddMarker}>
                  📍 Add POI
                </Button>
                <Button variant="outline" onClick={onZoomIn}>
                  🔍+ Zoom In
                </Button>
                <Button variant="outline" onClick={onZoomOut}>
                  🔍- Zoom Out
                </Button>
              </div>

              {/* Markers List */}
              {mapState.markers.length > 0 && (
                <div className="mt-4 text-left">
                  <h4 className="text-sm font-semibold mb-2">Active Markers:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {mapState.markers.slice(0, 5).map((marker) => (
                      <div key={marker.id} className="text-xs p-2 bg-gray-50 rounded flex items-center justify-between">
                        <span>
                          {marker.type === 'poi' && '📍'}
                          {marker.type === 'station' && '🚇'}
                          {marker.type === 'checkpoint' && '🎯'}
                          {marker.type === 'warning' && '⚠️'}
                          {' '}{marker.title}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          marker.status === 'active' ? 'bg-green-100 text-green-800' :
                          marker.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {marker.status}
                        </span>
                      </div>
                    ))}
                    {mapState.markers.length > 5 && (
                      <div className="text-xs text-gray-500 text-center">
                        ... and {mapState.markers.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MapComponent
