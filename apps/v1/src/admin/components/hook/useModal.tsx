import { useState } from 'react';

export interface ModalProps {
    mode: 'create' | 'edit';
    isOpen: boolean;
    onClose: () => void;
}

export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const openModal = (mode: 'create' | 'edit') => {
        setMode(mode);
        setIsOpen(true);
    };

    return {
        isOpen,
        mode,
        openModal,
        closeModal: () => setIsOpen(false)
    };
};