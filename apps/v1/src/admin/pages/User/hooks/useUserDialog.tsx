import { useState } from 'react';

export interface DialogProps {
    mode: 'create' | 'edit';
    isOpen: boolean;
    onClose: () => void;
}

export const useDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const openDialog = (mode: 'create' | 'edit') => {
        setMode(mode);
        setIsOpen(true);
    };

    return {
        isOpen,
        mode,
        openDialog,
        closeDialog: () => setIsOpen(false)
    };
};