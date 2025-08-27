import { useState, useEffect } from 'react';
import { Button, Label, Dialog, DialogContent, DialogFooter, RadioGroup, RadioGroupItem } from '@plug/ui';
import { FeatureAssignCombobox } from './FeatureAssignCombobox';
import { useCctvData } from '../hooks/useCctvData';
import { useDeviceData } from '../hooks/useDeviceData';
import { CctvResponse, DeviceResponse, assignDeviceToFeature } from '@plug/common-services';
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { getAllCctvs, isLoading: cctvsLoading } = useCctvData(); 
  const { getAllDevices, isLoading: devicesLoading } = useDeviceData();

  const currentItems = selectedType === 'CCTV' ? getAllCctvs : getAllDevices;
  const isLoading = selectedType === 'CCTV' ? cctvsLoading : devicesLoading;

  const isSelectedItemAssigned = (selectedId: string): boolean => {
    const selectedItem = currentItems.find(item => item.id === selectedId);
    
    if (selectedType === 'CCTV') {
      return Boolean((selectedItem as CctvResponse)?.feature?.id);
    } else{
      return Boolean((selectedItem as DeviceResponse)?.featureId);
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedType('CCTV'); 
      setSelectedId('');
    }
  }, [open]);

  useEffect(() => {
    if (isSelectedItemAssigned(selectedId)) {
      setIsConfirmOpen(true);
      }
  }, [selectedId]);

  const handleSubmit = async () => {
    if (!selectedId || !featureId) return;
    
    try {
      await assignDeviceToFeature(featureId, { 
        id: selectedId,  
        type: selectedType  
      });
      
      toast.success('장비가 성공적으로 할당되었습니다.');
      onOpenChange(false);
      setSelectedId('');
    } catch (error) {
      console.error('장비 할당 중 오류:', error);
      toast.error('장비 할당 중 오류가 발생했습니다.');
    }
  };

  // 교체 할당
  const handleConfirm = async () => {
    if (!featureId || !selectedId) return;

    try {
      await assignDeviceToFeature(featureId, { 
        id: selectedId,  
        type: selectedType  
      }, true);

      toast.success('장비가 성공적으로 교체되었습니다.');
      setIsConfirmOpen(false);
      setSelectedId('');
      onOpenChange(false);
    } catch (error) {
      console.error('장비 교체 중 오류:', error);
      toast.error('장비 교체 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    setSelectedId('');
    onOpenChange(false);
  };

  const handleConfirmCancel = () => {
    setSelectedId('');
    setIsConfirmOpen(false);
    onOpenChange(true); 
  };

  const handleTypeChange = (type: 'CCTV' | 'DEVICE') => {
    setSelectedType(type);
    setSelectedId(''); 
  };

  return (
    <>
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
            
            {isLoading ? (
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
                items={currentItems}
                groups={[
                  {
                    key: 'available',
                    title: `미할당 장비`,
                    filterFn: (item: CctvResponse | DeviceResponse) => {
                      if (selectedType === 'CCTV') {
                        const cctvItem = item as CctvResponse;
                        return !Boolean(cctvItem.feature?.id); 
                      } else {
                        const deviceItem = item as DeviceResponse;
                        return !Boolean(deviceItem.featureId); 
                      }
                    }
                  },
                  {
                    key: 'unavailable',
                    title: `이미 할당된 장비`,
                    filterFn: (item: CctvResponse | DeviceResponse) => {
                      if (selectedType === 'CCTV') {
                        const cctvItem = item as CctvResponse;
                        return Boolean(cctvItem.feature?.id); 
                      } else {
                        const deviceItem = item as DeviceResponse;
                        return Boolean(deviceItem.featureId); 
                      }
                    }
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
              disabled={isLoading}
            >
              {isLoading ? '할당 중...' : '확인'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    {isConfirmOpen && (
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent title="장비 교체" dimmed disableBackground>
          {`${selectedType}의 ${selectedId} 장비가 이미 할당되어 있습니다. 교체하시겠습니까?`}
          <DialogFooter>
            <Button variant="outline" onClick={handleConfirmCancel}>취소</Button>
            <Button onClick={handleConfirm}>확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </>
  );
}