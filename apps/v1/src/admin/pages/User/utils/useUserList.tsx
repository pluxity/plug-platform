import { UserResponse } from '@plug/common-services';
import { User } from '../types/UserList.types';
import { Button } from '@plug/ui';

export const useUserList = (
    data: UserResponse[],
    contactData: Record<number,boolean>,
    onDelete: (userId: number) => void,
    onEdit: (assetId: number) => void,
    onPasswordEdit: (userId: number) => void
  ): User[] => {
    return data.map(user => ({
      id: String(user.id),
      username: user.username,
      phoneNumber: user.phoneNumber,
      department: user.department,
      contact: contactData[user.id] 
      ? <span className="inline-block rounded-full w-4 h-4 bg-green-500 border border-gray-200 shadow-md" /> 
      : <span className="inline-block rounded-full w-4 h-4 bg-red-500 border border-gray-200 shadow-md" />,
      management: (
        <div className="flex flex-wrap gap-1">
          <Button color="primary" className="w-15" onClick={() => onEdit(user.id)}>수정</Button>
          <Button color="secondary" className="w-33" onClick={() => onPasswordEdit(user.id)}>비밀번호 수정</Button>
          <Button 
            color="destructive" 
            className="w-15"
            onClick={() => {onDelete(user.id)}}
          >삭제</Button>
        </div>
      ),
    }));
  } 