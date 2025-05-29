import * as Px from "@plug/engine/src";
import {useCallback, useState} from "react";

interface FileResponse {
  timestamp: string;
  status: number;
  message: string;
  data: {
    id: number;
    url: string;
    originalFileName: string;
    contentType: string;
    fileStatus: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface ModelInfo {
  objectName: string;
  displayName: string;
  sortingOrder: number;
  floorId: string;
}

const fetchFloorInfo = async (fileId: number): Promise<ModelInfo[]> => {
  try {
    const fileResponse = await fetch(`/files/${fileId}`);
    const fileData: FileResponse = await fileResponse.json();

    return new Promise((resolve, reject) => {
      Px.Model.GetModelHierarchy(
        fileData.data.url,
        (data: ModelInfo[]) => {
          resolve(data);
        },
        (error: Error) => {
          reject(error);
        }
      );
    });
  } catch (error) {
    console.error('층 정보를 가져오는데 실패했습니다:', error);
    throw error;
  }
};

export const useFloorInfo = () => {
    const [floors, setFloors] = useState<ModelInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleFileUploadComplete = useCallback(async (fileId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const floorData = await fetchFloorInfo(fileId);
            const sortedFloors = floorData.sort((a, b) => a.sortingOrder - b.sortingOrder);
            setFloors(sortedFloors);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('층 정보를 불러오는데 실패했습니다'));
            console.error('층 정보 로딩 실패:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        floors,
        isLoading,
        error,
        handleFileUploadComplete
    };
};