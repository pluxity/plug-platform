import React, { useRef } from 'react'


const IndoorMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />

    </div>
  )
}

export default IndoorMap
