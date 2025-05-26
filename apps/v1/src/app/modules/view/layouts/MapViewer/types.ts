// MapViewer 관련 타입 정의

export interface MapViewerProps {
  modelPath: string;
  onModelLoaded: () => void;
  onLoadError?: (error: Error) => void;
}

export interface ModelInfo {
  url: string;
  name: string;
  format: 'gltf' | 'glb' | 'fbx';
}

export interface ViewerSettings {
  enableControls?: boolean;
  backgroundColor?: string;
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };
}
