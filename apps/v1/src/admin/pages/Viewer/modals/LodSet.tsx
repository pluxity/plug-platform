import { Modal, Select, Button, Input, Tab } from '@plug/ui';
import { LodSetAddStep, LodSetStepValues, LodSetSelectOptions } from '../mocks/LodSet.mock';
import { useState } from 'react';

export interface PoiBatRegistProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LodSetModal = ({ isOpen, onClose }: PoiBatRegistProps) => {
    const [selectedAddLodSet, setSelectedAddLodSet] = useState<number>(3); 

     const addLodSet = Array.from({ length: selectedAddLodSet }, (_, idx) => `${idx + 1}단계`);

     const handleAddLodSet = (value: string[]) => {
        const newValue = Number(value[0].replace('단계', ''));
        setSelectedAddLodSet(newValue); 
    };

    return (
        <Modal
            title="LOD 설정"
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
            contentClassName="w-300" 
            overlayClassName="bg-black/50"
        >
        <div className="flex border border-gray-300 min-h-20">
            <div className="flex w-1/2 border-r border-gray-300">
            <div className="flex flex-col w-1/3 bg-gray-200 p-4 justify-center items-center">
                <span className="font-bold text-center">최장거리 설정</span>
            </div>
            <div className="flex flex-1 gap-2 p-4 items-center">
                <Button type="button">
                현재화면 기준
                </Button>
                <Input.Text className="w-60"/>
            </div>
            </div>

            <div className="flex w-1/2">
            <div className="flex flex-col w-1/3 bg-gray-200 p-4 justify-center items-center">
                <span className="font-bold text-center">LOD 레벨수</span>
            </div>
            <div className="flex flex-1 gap-2 p-4 items-center">
                <Select 
                    className="w-full"
                    onChange={handleAddLodSet}
                >
                    <Select.Trigger placeholder="LOD선택" />
                    <Select.Content>
                        {LodSetAddStep.map((option, optIdx) => (
                            <Select.Item key={optIdx} value={option}>{option}</Select.Item>
                        ))}
                    </Select.Content>
                </Select>
            </div>
            </div>
        </div>

        <div className="mt-10">
            <Tab defaultValue='poi'>
                <Tab.List color='primary' className="whitespace-nowrap w-50">
                    <Tab.Trigger value="poi" className="bg-gray-200 rounded-sm">POI 크기</Tab.Trigger>
                    <Tab.Trigger value="lod" className="bg-gray-200 rounded-sm">LOD 설정</Tab.Trigger>
                </Tab.List>
                <Tab.Content value="poi">
                <div className="border border-gray-300 rounded-md overflow-auto">
                        <div className="flex bg-gray-200 font-bold border-b border-gray-300">
                            <div className="flex items-center justify-center w-1/8 p-2">대분류</div>
                            <div className="flex items-center justify-center w-1/8 p-2">중분류</div>
                            {addLodSet.map((step, idx) => (
                                <div key={idx} className="w-1/4 p-2 flex flex-col gap-2">
                                    <div className="text-center">{step}</div>
                                    <Select className="font-light w-full">
                                        <Select.Trigger placeholder="일괄등록" />
                                        <Select.Content>
                                            {LodSetSelectOptions.map((option, optIdx) => (
                                                <Select.Item key={optIdx} value={option}>{option}</Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select>
                                </div>
                            ))}
                        </div>

                        {LodSetStepValues.map((value, idx) => (
                            <div key={idx} className="flex border-b border-gray-200">
                                <div className="flex items-center w-1/8 p-2">{value.category}</div>
                                <div className="flex items-center w-1/8 p-2">{value.subcategory}</div>
                                {addLodSet.map((stepIdx) => (
                                    <div key={stepIdx} className="w-1/4 p-2">
                                        <Select className="w-full">
                                            <Select.Trigger placeholder="일괄등록" />
                                            <Select.Content>
                                                {LodSetSelectOptions.map((option, optIdx) => (
                                                    <Select.Item key={optIdx} value={option}>{option}</Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                            ))}
                    </div>
                </Tab.Content>
                <Tab.Content value="lod">두번째 콘텐츠 영역</Tab.Content>
            </Tab>
        </div>
    </Modal>
  );
};
