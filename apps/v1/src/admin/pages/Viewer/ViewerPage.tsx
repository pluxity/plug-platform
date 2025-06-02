import { useState, useCallback, memo, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Select } from "@plug/ui";
import { useStationStore } from './store/stationStore';
import type { ModelInfo, PoiImportOption } from "@plug/engine/src/interfaces";

import { AssetList, MapViewer, FeatureEditToolbar } from "./components";
import { PoiEditModal, ErrorBoundary } from "./components";
import { useStation, useEditMode, useEngineIntegration } from "./hooks";
import type { UseEditModeResult } from "./hooks/useEditMode";
import type { StationWithFeatures } from "./types/station";

// Loading and Error components with better UX
const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-pulse text-gray-500">역사 데이터 로딩 중...</div>
  </div>
));

const ErrorMessage = memo(({ message }: { message: string }) => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-red-500">{message}</div>
  </div>
));

// Floor selector component
const FloorSelector = memo(({ 
  hierarchies, 
  selectedFloor, 
  onFloorChange 
}: {
  hierarchies: ModelInfo[];
  selectedFloor: string | null;
  onFloorChange: (floorId: string) => void;
}) => {  const handleFloorSelect = (values: string[]) => {
    const floorId = values[0];
    if (floorId) {
      onFloorChange(floorId);
    }
  };

  return (
    <Select 
      className="text-sm text-gray-300 ml-2 w-64" 
      selected={selectedFloor ? [selectedFloor] : []}
      onChange={handleFloorSelect}
    >
      <Select.Trigger />
      <Select.Content>
        {hierarchies
          .sort((a, b) => Number(b.floorId) - Number(a.floorId))
          .map(floor => (
            <Select.Item key={floor.floorId} value={floor.floorId}>
              {floor.displayName}
            </Select.Item>
          ))
        }
      </Select.Content>
    </Select>
  );
});

// Main header component
const ViewerHeader = memo(({ 
  stationName, 
  hierarchies, 
  selectedFloor, 
  onFloorChange 
}: {
  stationName: string;
  hierarchies: ModelInfo[] | null;
  selectedFloor: string | null;
  onFloorChange: (floorId: string) => void;
}) => (
  <div className="flex absolute text-white pl-4 pt-2 items-center z-10">
    <h2 className="text-xl font-bold">{stationName}</h2>
    {hierarchies && (
      <FloorSelector 
        hierarchies={hierarchies}
        selectedFloor={selectedFloor}
        onFloorChange={onFloorChange}
      />
    )}
  </div>
));

// Main viewer content component
const ViewerContent = memo(({  stationData,
  hierarchies,
  selectedFloor,
  onFloorChange,
  onModelLoaded,
  editMode,
  selectedPoi,
  isModalOpen,
  onModalClose
}: {
  stationData: StationWithFeatures;
  hierarchies: ModelInfo[] | null;
  selectedFloor: string | null;
  onFloorChange: (floorId: string) => void;
  onModelLoaded: () => void;
  editMode: UseEditModeResult;
  selectedPoi: PoiImportOption | null;
  isModalOpen: boolean;
  onModalClose: () => void;
}) => {
  const modelPath = stationData?.facility?.drawing?.url || '';

  return (
    <>
      <aside className="bg-white w-1/4 overflow-y-auto shrink-0">
        <AssetList />
      </aside>
      <main className="w-full">
        <ViewerHeader
          stationName={stationData?.facility?.name || ''}
          hierarchies={hierarchies}
          selectedFloor={selectedFloor}
          onFloorChange={onFloorChange}
        />
        <Suspense fallback={<LoadingSpinner />}>
          <MapViewer 
            modelPath={modelPath}
            onModelLoaded={onModelLoaded}
          />
        </Suspense>        <FeatureEditToolbar
          onTranslateMode={editMode.setTranslateMode}
          onRotateMode={editMode.setRotateMode}
          onScaleMode={editMode.setScaleMode}
          onExitEdit={editMode.exitEdit}
          currentMode={editMode.currentMode}
        />
      </main>
      
      {/* POI Edit Modal */}
      <PoiEditModal
        poi={selectedPoi}
        isOpen={isModalOpen}
        onClose={onModalClose}
      />
    </>
  );
});

// Main ViewerPage component with React 19 patterns
const ViewerPage = memo(() => {
  const { stationId: stationIdFromParams } = useParams<{ stationId: string }>();
  const { currentStationId, setStationId } = useStationStore();
  
  // Initialize station ID with proper fallback
  const stationId = stationIdFromParams || currentStationId || '2';
  
  // Ensure station ID is set in store
  if (stationId !== currentStationId) {
    setStationId(stationId);
  }  // Custom hooks for state management
  const { data: stationData, isLoading, error } = useStation(stationId);
  const editMode = useEditMode();
  
  // Local state
  const [hierarchies, setHierarchies] = useState<ModelInfo[] | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<PoiImportOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Event handlers
  const handlePoiSelect = useCallback((poi: PoiImportOption) => {
    setSelectedPoi(poi);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPoi(null);
  }, []);
  const handleHierarchyLoaded = useCallback((hierarchy: ModelInfo[]) => {
    setHierarchies(hierarchy);
    // Set initial floor to the highest floor (or first floor if needed)
    if (hierarchy && hierarchy.length > 0) {
      const sortedFloors = hierarchy.sort((a, b) => Number(b.floorId) - Number(a.floorId));
      const initialFloor = sortedFloors[0]?.floorId;
      if (initialFloor) {
        setSelectedFloor(initialFloor);
      }
    }
  }, []);
  const handleFloorChangeUI = useCallback((floorId: string) => {
    setSelectedFloor(floorId);
  }, []);
  // Engine integration with cleanup
  const { handleModelLoaded, handleFloorChange } = useEngineIntegration({
    stationData,
    onPoiSelect: handlePoiSelect,
    onHierarchyLoaded: handleHierarchyLoaded,
    onFloorChange: handleFloorChangeUI
  });

  // Combined floor change handler for UI interactions
  const handleFloorSelect = useCallback((floorId: string) => {
    // Call the engine integration's floor change handler
    handleFloorChange(floorId);
  }, [handleFloorChange]);

  // Error boundary states
  if (error) {
    return <ErrorMessage message="역사 데이터를 불러오는데 실패했습니다." />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!stationData) {
    return <ErrorMessage message="Station ID를 찾을 수 없습니다." />;  }
  return (
    <ErrorBoundary>      <ViewerContent
        stationData={stationData}
        hierarchies={hierarchies}
        selectedFloor={selectedFloor}
        onFloorChange={handleFloorSelect}
        onModelLoaded={handleModelLoaded}
        editMode={editMode}
        selectedPoi={selectedPoi}
        isModalOpen={isModalOpen}
        onModalClose={handleModalClose}
      />
    </ErrorBoundary>
  );
});

ViewerPage.displayName = 'ViewerPage';

export default ViewerPage;