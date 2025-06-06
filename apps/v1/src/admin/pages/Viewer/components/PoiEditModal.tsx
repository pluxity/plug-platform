import { useCallback } from 'react';
import { Modal, Form, FormItem, Input, Button } from '@plug/ui';
import { useFeatureApi } from '../hooks';
import * as Px from '@plug/engine/src';
import type { PoiImportOption } from '@plug/engine/src/interfaces';
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";

interface PoiEditModalProps {
  isOpen: boolean;
  poi: PoiImportOption | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PoiEditModal({ isOpen, poi, onClose, onSuccess }: PoiEditModalProps) {
  const { assignDevice } = useFeatureApi();

  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = useCallback(async (values: Record<string, string>) => {
    if (!poi) return;
    
    try {
      const id = values.id || poi.property?.id;
      await assignDevice(poi.id, id);
      Px.Poi.SetDisplayText(poi.id, id || '장비 할당 완료');
      onSuccess?.();
      onClose();
    } catch (error) {
      addToast({
          variant: 'critical',
          title: '장비 할당 실패',
          placement: 'center',
          description: error instanceof Error ? error.message : '장비 할당 중 오류가 발생했습니다.'
      });
      // console.error('Failed to update device code:', error);
    }
  }, [poi, assignDevice, onSuccess, onClose, addToast]);

  if (!poi) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={poi.displayText || 'Feature'}
    >
      <Form
        initialValues={{
          code: poi.property?.code || ''
        }}
        onSubmit={handleSubmit}
      >
        <FormItem name="id" label="장비 ID" required>
          <Input.Text placeholder={poi.displayText ?? "장비 ID를 입력하세요"} />
        </FormItem>
        <Button type="submit" color="primary">
          적용
        </Button>
      </Form>
    </Modal>
  );
}
