import { useEffect, useState } from 'react';
import { useProfileStore } from './useProfileStore';
import { useNavigate } from 'react-router-dom';
import { Toast } from '@plug/ui';

export const SessionExpiredToast = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: () => void }) => (
    <Toast isOpen={isOpen} onChange={onOpenChange}>
        <Toast.Description>
            세션이 만료되었습니다. 다시 로그인 해주세요.
        </Toast.Description>
    </Toast>
);

export const useSessionWatcher = () => {
    const { expiresAt, clearUser } = useProfileStore();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    const handleSessionExpiration = () => {
        if (expiresAt && Date.now() > expiresAt) {
            clearUser();
            setShowToast(true);
            navigate('/login');
        }
    };

    useEffect(() => {
        handleSessionExpiration();
    }, [expiresAt, clearUser, navigate]);

    useEffect(() => {
        const interval = setInterval(handleSessionExpiration, 60 * 1000);
        return () => clearInterval(interval);
    }, [expiresAt, clearUser, navigate]);

    return {
        showToast,
        setShowToast
    };
};