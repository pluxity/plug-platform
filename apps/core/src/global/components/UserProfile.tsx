import React, { useEffect, useState, useCallback } from 'react';
import { Profile } from '@plug/ui';
import { useAuthStore } from '@/global/store';
import { useSignOut, getUserProfile } from '@plug/common-services/services';
import type { UserProfile as UserProfileType  } from '@plug/common-services';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  showAdminPortal?: boolean; // 관리자 페이지(백오피스) 진입 버튼 표시 여부
  className?: string;        // 아바타 트리거 커스터마이징
  panelWidthClass?: string;  // 내용물 width Tailwind 클래스 (기본 w-56)
  alignInfoToRight?: boolean; // 내부 필드 값 오른쪽 정렬 여부
}

const UserProfile: React.FC<UserProfileProps> = ({
  showAdminPortal = true,
  className,
  panelWidthClass = 'w-56',
  alignInfoToRight = true,
}) => {
  const navigate = useNavigate();
  const { clearAuth, hasRole } = useAuthStore();
  const { execute: signOut, isLoading: isSigningOut } = useSignOut();
  const isAdmin = hasRole('ADMIN');

  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserProfile();
        if (mounted) setUserProfile(data);
      } catch {
        if (mounted) setError('정보를 불러오지 못했습니다');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      clearAuth();
      navigate('/login');
    } catch {
      clearAuth();
      navigate('/login');
    }
  }, [signOut, clearAuth, navigate]);

  const valueAlignCls = alignInfoToRight ? 'text-right' : '';

  return (
    <Profile
      type="custom"
      className={['space-x-0 p-1 bg-white/90 rounded-full shadow hover:bg-white transition [&>div:last-child]:hidden', className].filter(Boolean).join(' ')}
      profileTitle={undefined}
      profileDescription={undefined}
      profileImage={undefined}
    >
      <div className={`${panelWidthClass} p-2`}>
        <div className="mb-3 border-b pb-2">
          <p className="text-sm font-semibold mb-1">내 정보</p>
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-4/5" />
              <div className="h-3 bg-gray-200 rounded w-3/5" />
            </div>
          ) : error ? (
            <div className="text-xs text-red-500">{error}</div>
          ) : (
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">이름</span>
                <span className={`font-medium truncate max-w-[60%] ${valueAlignCls}`}>{userProfile?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">부서</span>
                <span className={`truncate max-w-[60%] ${valueAlignCls}`}>{userProfile?.department || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">연락처</span>
                <span className={`truncate max-w-[60%] ${valueAlignCls}`}>{userProfile?.phoneNumber || '-'}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {isAdmin && showAdminPortal && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-sky-600 hover:text-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-sky-300/70"
            >관리자 페이지로 이동</button>
          )}
          <button
            type="button"
            disabled={isSigningOut}
            onClick={handleLogout}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-red-50 text-sm text-red-600 disabled:opacity-60"
          >{isSigningOut ? '로그아웃 중...' : '로그아웃'}</button>
        </div>
      </div>
    </Profile>
  );
};

export default UserProfile;
