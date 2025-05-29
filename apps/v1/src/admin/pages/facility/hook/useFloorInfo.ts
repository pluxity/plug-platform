import { useState } from 'react';
import { api } from '@plug/api-hooks';
import * as Px from "@plug/engine/src";
import { ModelInfo } from "@plug/engine/src/interfaces";
import { FileResponse } from '@plug/common-services';

export const useFloorInfo = () => {
    const [modelData, setModelData] = useState<ModelInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getModelInfo = async (locationHeader: string) => {
        if (!locationHeader) throw new Error('업로드 응답에 Location이 없습니다.');

        setIsLoading(true);
        try {
            const fileResponse = await api.get<FileResponse>(locationHeader.replace(/^\//, ''));
            const fileUrl = fileResponse.data.url;

            const data = await new Promise<ModelInfo[]>((resolve, reject) => {
                Px.Model.GetModelHierarchy(fileUrl, (data: ModelInfo[]) => {
                    resolve(data);
                }, (error: Error) => {
                    reject(error);
                });
            });

            setModelData(data);
            console.log(data)
            return data;
        } catch (error) {
            console.error('모델 정보 로드 실패:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const resetModelData = () => {
        setModelData([]);
    };

    return {
        modelData,
        isLoading,
        getModelInfo,
        resetModelData
    };
};
