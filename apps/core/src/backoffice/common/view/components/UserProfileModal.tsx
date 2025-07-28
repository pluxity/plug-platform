import React from 'react';
import { Dialog, DialogContent } from '@plug/ui';
import { useAuthStore } from '@/global/store';

interface UserProfileModalProps {
  show: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ show, onClose }) => {
  const { user } = useAuthStore();

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent title="내 정보">
        {user && (
          <div className="space-y-4">
            <div>
              <label className="font-bold">이름:</label>
              <p>{user.name}</p>
            </div>
            <div>
              <label className="font-bold">사용자 코드:</label>
              <p>{user.code}</p>
            </div>
            <div>
              <label className="font-bold">사용자 ID:</label>
              <p>{user.username}</p>
            </div>
            <div>
              <label className="font-bold">역할:</label>
              <p>{user.roles?.map(role => role.name).join(', ')}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;