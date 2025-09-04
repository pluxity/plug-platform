import { useCesiumCreditContainer } from '../hooks/useCesiumCreditContainer';

import React from 'react';
import { Viewer as ResiumViewer, type ViewerProps } from 'resium';
const disabled: Partial<ViewerProps> = {
  animation: false,
  timeline: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  vrButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
};

export interface BaseCesiumViewerProps
  extends Omit<ViewerProps, 'full' | 'creditContainer' | 'className'> {
  className?: string;
  children?: React.ReactNode;
  creditContainerId?: string;
}

export const BaseCesiumViewer: React.FC<BaseCesiumViewerProps> = ({
  className = 'w-full h-full',
  children,
  creditContainerId,
  ...rest
}) => {
  const { creditRef, creditId } = useCesiumCreditContainer(creditContainerId);

  return (
    <>
      <div ref={creditRef} style={{ display: 'none' }} />
      {creditId && (
        <ResiumViewer
          full
          className={`cesium-container ${className}`.trim()}
          creditContainer={creditId}
          {...disabled}
          {...rest}
        >
          {children}
        </ResiumViewer>
      )}
    </>
  );
};

export default BaseCesiumViewer;
