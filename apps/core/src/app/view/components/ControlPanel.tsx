import React from 'react'
import { Card, CardContent, Button } from '@plug/ui'

interface ControlPanelProps {
  onCenterMap: () => void
  onToggleMeasure: () => void
  onToggleLayers: () => void
  onRefreshStatus: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onCenterMap,
  onToggleMeasure,
  onToggleLayers,
  onRefreshStatus
}) => {
  return (
    <div className="absolute top-4 right-4 space-y-4">
      <Card className="bg-white bg-opacity-90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Button variant="outline" size="sm" className="w-full" onClick={onCenterMap}>
              🎯 Center Map
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={onToggleMeasure}>
              📐 Measure
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={onToggleLayers}>
              🗂️ Layers
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={onRefreshStatus}>
              🔄 Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ControlPanel
