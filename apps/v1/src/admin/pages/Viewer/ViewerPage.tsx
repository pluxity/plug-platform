import { useState, useCallback, memo, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Select, ConfirmModal } from "@plug/ui";
import { useStationStore } from './store/stationStore';
import type { ModelInfo, PoiImportOption } from "@plug/engine/src/interfaces";

import { AssetList, MapViewer, FeatureEditToolbar } from "./components";
import { PoiEditModal, ErrorBoundary } from "./components";
import { useStation, useEditMode, useEngineIntegration, useFeatureApi } from "./hooks";
import type { UseEditModeResult } from "./hooks/useEditMode";
import type { StationWithFeatures } from "./types/station";

import * as Px from '@plug/engine/src';

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
        </Suspense>          
        <FeatureEditToolbar
          onTranslateMode={editMode.setTranslateMode}
          onRotateMode={editMode.setRotateMode}
          onScaleMode={editMode.setScaleMode}
          onDeleteMode={editMode.setDeleteMode}
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
  const { deleteFeature } = useFeatureApi();
    // Local state
  const [hierarchies, setHierarchies] = useState<ModelInfo[] | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<PoiImportOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ConfirmModal 상태
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
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
  }, []);  const handleFloorChangeUI = useCallback((floorId: string) => {
    setSelectedFloor(floorId);
  }, []);  // POI 삭제 핸들러
  const handlePoiDelete = useCallback((poi: PoiImportOption) => {
    setConfirmModal({
      isOpen: true,
      title: 'POI 삭제 확인',
      message: `"${poi.displayText}" POI를 삭제하시겠습니까?`,
      onConfirm: async () => {
        try {
          // 엔진에서 POI 삭제
          Px.Poi.Delete(poi.id);
          
          // API를 통한 서버 삭제
          await deleteFeature(poi.id);
          
          console.log('POI 삭제 완료:', poi);
        } catch (error) {
          console.error('POI 삭제 중 오류 발생:', error);
        }
      }
    });  }, [deleteFeature]);

  // ConfirmModal 닫기 핸들러
  const handleConfirmModalClose = useCallback(() => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  }, []); // Engine integration with cleanup
  const { handleModelLoaded, handleFloorChange } = useEngineIntegration({
    stationData,
    onPoiSelect: handlePoiSelect,
    onHierarchyLoaded: handleHierarchyLoaded,
    onFloorChange: handleFloorChangeUI,
    onPoiDeleteClick: editMode.currentMode === 'delete' ? handlePoiDelete : undefined
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
    return <ErrorMessage message="Station ID를 찾을 수 없습니다." />;  
  }  
  
  return (
    <ErrorBoundary>
      <ViewerContent
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
      
      {/* Confirm Modal for POI deletion */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleConfirmModalClose}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="삭제"
        cancelText="취소"
        isDangerous={true}
      />
    </ErrorBoundary>
  );
});

ViewerPage.displayName = 'ViewerPage';

export default ViewerPage;