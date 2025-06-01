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
  const { updateDeviceCode } = usePoiApi();

  const handleSubmit = useCallback(async (values: Record<string, string>) => {
    if (!poi) return;
    
    try {
      const code = values.code || poi.property?.code;
      await updateDeviceCode(poi.id, code);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update device code:', error);
    }
  }, [poi, updateDeviceCode, onSuccess, onClose]);

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
        <FormItem name="code" label="디바이스 코드" required>
          <Input.Text placeholder="디바이스 코드를 입력하세요" />
        </FormItem>
        <Button type="submit" color="primary">
          적용
        </Button>
      </Form>
    </Modal>
  );
}
