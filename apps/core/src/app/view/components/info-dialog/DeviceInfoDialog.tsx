import React from 'react'
import type { GsDeviceResponse } from '@plug/common-services'
import InfoDialog from './InfoDialog'

export interface DeviceInfoDialogProps {
  device: GsDeviceResponse | null
  onClose?: () => void
  hole?: { x?: string; y?: string; w?: string; h?: string } | false
}

const DeviceInfoDialog: React.FC<DeviceInfoDialogProps> = ({ device, onClose, hole = undefined }) => {
  if (!device) return null

  const badges = (
    <>
      <span className="px-[0.625rem] py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 backdrop-blur-sm">ID: {device.id}</span>
      {device.deviceCategory?.name && (
        <span className="px-[0.625rem] py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm">
          {device.deviceCategory.name}
        </span>
      )}
    </>
  )

  const body = (
    <div className="flex flex-col gap-6 pr-4 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4 text-sm text-slate-200">
      </div>
    </div>
  )

  const footer = (
    <button
      onClick={onClose}
      className="inline-flex items-center gap-2 px-[1.25rem] py-2.5 rounded-xl text-sm font-semibold tracking-wide bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white shadow-lg shadow-indigo-900/40 hover:shadow-pink-900/40 transition focus:outline-none focus:ring-2 focus:ring-pink-300/50"
    >
      닫기
    </button>
  )

  return (
    <InfoDialog
      open={!!device}
      title={device.name || '장치 정보'}
      onClose={onClose}
      badges={badges}
      footer={footer}
      hole={hole}
      className={hole === false ? 'w-[36rem] max-w-[90vw]' : undefined}
    >
      {body}
    </InfoDialog>
  )
}

export default DeviceInfoDialog
