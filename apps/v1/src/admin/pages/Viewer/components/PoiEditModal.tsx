import { useCallback } from 'react';
import { Modal, Form, FormItem, Input, Button } from '@plug/ui';
import { usePoiApi } from '../hooks';
import type { PoiImportOption } from '@plug/engine/src/interfaces';

interface PoiEditModalProps {
  isOpen: boolean;
  poi: PoiImportOption | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PoiEditModal({ isOpen, poi, onClose, onSuccess }: PoiEditModalProps) {
  const { assignDevice } = usePoiApi();

  const handleSubmit = useCallback(async (values: Record<string, string>) => {
    if (!poi) return;
    
    try {
      const id = values.id || poi.property?.id;
      await assignDevice(poi.id, id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update device code:', error);
    }
  }, [poi, assignDevice, onSuccess, onClose]);

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
          <Input.Text placeholder="장비 ID를 입력하세요" />
        </FormItem>
        <Button type="submit" color="primary">
          적용
        </Button>
      </Form>
    </Modal>
  );
}
