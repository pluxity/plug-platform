import { UserResponse } from '@plug/common-services';
import { User } from '../types/user.types';
import { Button } from '@plug/ui';

export const useUser = (
    data: UserResponse[],
    statusData: Record<number,boolean>,
    onDelete: (userId: number) => void,
    onEdit: (assetId: number) => void,
    onPasswordEdit: (userId: number) => void,
    onRoleEdit: (userId: number) => void
  ): User[] => {
    return data.map(user => ({
      id: String(user.id),
      username: user.username,
      phoneNumber: user.phoneNumber,
      department: user.department,
      status: statusData[user.id] 
      ? <span className="inline-block rounded-full w-4 h-4 bg-green-500 border border-gray-200 shadow-md" /> 
      : <span className="inline-block rounded-full w-4 h-4 bg-red-500 border border-gray-200 shadow-md" />,
      role: user.roles.map(role => role.description).join(', '),
      management: (
        <div className="flex flex-wrap gap-1">
          <Button color="primary" className="w-15" onClick={() => onEdit(user.id)}>수정</Button>
          <Button color="primary" className="w-15" onClick={() => onRoleEdit(user.id)}>권한</Button>
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