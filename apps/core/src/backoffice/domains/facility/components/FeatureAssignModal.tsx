import { useState, useEffect } from 'react';
import { Button, Label, Dialog, DialogContent, DialogFooter, RadioGroup, RadioGroupItem } from '@plug/ui';
import { FeatureAssignCombobox } from './FeatureAssignCombobox';
import { useCctvData } from '../hooks/useCctvData';
import { CctvResponse, assignDeviceToFeature } from '@plug/common-services';
import { toast } from 'sonner';

interface FeatureAssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureId?: string;
}

export function FeatureAssignModal({
  open,
  onOpenChange,
  featureId,
}: FeatureAssignModalProps) {
  const [selectedType, setSelectedType] = useState<'CCTV' | 'DEVICE'>('CCTV'); 
  const [selectedId, setSelectedId] = useState<string>('');

  const { getAllCctvs, isLoading: cctvsLoading } = useCctvData(); 

  useEffect(() => {
    if (open) {
      setSelectedType('CCTV'); 
      setSelectedId('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedId || !featureId) return;
    
    try {
      await assignDeviceToFeature(featureId, { 
        id: selectedId,  
        type: selectedType  
      });
      
      toast.success('장비가 성공적으로 할당되었습니다.');
      onOpenChange(false);
      
    } catch (error) {
      console.error('장비 할당 중 오류:', error);
      toast.error('장비 할당 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setSelectedId('');
    onOpenChange(false);
  };

  const handleTypeChange = (type: 'CCTV' | 'DEVICE') => {
    setSelectedType(type);
    setSelectedId(''); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="장비 할당">
        <div className="grid gap-2">
          <Label>연결 대상 타입</Label>
          <RadioGroup
            value={selectedType}
            onValueChange={(value) => {
              if (value === 'CCTV' || value === 'DEVICE') {
                handleTypeChange(value);
              }
            }}
            className="flex flex-row space-x-4"
          >
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="CCTV" id="cctv" />
              CCTV
            </label>

            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="DEVICE" id="device" />
              Device
            </label>
          </RadioGroup>
        </div>

        <div className="grid gap-2 mt-4">
          <Label>장비 할당</Label>
          
          {cctvsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">데이터를 불러오는 중...</span>
            </div>
          ) : (
            <FeatureAssignCombobox
              selectedId={selectedId}
              onSelect={setSelectedId}
              placeholder={`할당할 장비를 선택하세요`}
              className="w-full"
              items={getAllCctvs}
              groups={[
                {
                  key: 'available',
                  title: `미할당 장비`,
                  filterFn: (item: CctvResponse) => Boolean(!item.feature?.id || item.feature?.id === ""), 
                },
                {
                  key: 'unavailable',
                  title: `이미 할당된 장비`,
                  filterFn: (item: CctvResponse) => Boolean(item.feature?.id && item.feature?.id !== ""), 
                }
              ]}
            />
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={cctvsLoading}
          >
            {cctvsLoading ? '할당 중...' : '확인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}