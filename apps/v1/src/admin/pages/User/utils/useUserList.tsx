import { UserResponse } from '@plug/common-services';
import { User } from '../types/UserList.types';
import { Button } from '@plug/ui';

export const useUserList = (
    data: UserResponse[],
    openModal: (mode: 'create' | 'edit') => void,
    onDelete: (userId: number) => void,
  ): User[] => {
    return data.map(user => ({
      id: String(user.id),
      username: user.username,
      code: user.code,
      management: (
        <div className="flex flex-wrap gap-1">
          <Button color="primary" className="w-15" onClick={() => openModal('edit')}>수정</Button>
          <Button 
            color="destructive" 
            className="w-15"
            onClick={() => {onDelete(user.id)}}
          >삭제</Button>
        </div>
      ),
    }));
  } 