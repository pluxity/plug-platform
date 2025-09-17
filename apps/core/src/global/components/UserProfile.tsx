import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useCallback, useMemo } from 'react';

import type { UserProfile as UserProfileType  } from '@plug/common-services';
import { useSignOut, getUserProfile } from '@plug/common-services/services';
import { Profile } from '@plug/ui';

import { useAuthStore } from '@/global/store';

interface UserProfileProps {
  showAdminPortal?: boolean;
  className?: string;
  panelWidthClass?: string;
  alignInfoToRight?: boolean;
}

// 커스텀 훅으로 스타일 분리
const useUserProfileStyles = (isAdmin: boolean, showAdminPortal: boolean) => {
  return useMemo(() => {
    const isAdminUser = isAdmin && showAdminPortal;
    
    return {
      trigger: isAdminUser 
        ? 'rounded-sm shadow transition'
        : 'space-x-3 min-w-30 px-3 py-1 rounded-sm shadow transition liquid-glass',
      
      dropdown: isAdminUser 
        ? 'liquid-glass bg-secondary-600/40 border border-secondary-100/20 right-6 transform transition-all duration-400 ease-out'
        : 'fixed right-0',
      
      infoSection: isAdminUser 
        ? 'mb-3 border-b border-primary-200/30 pb-2'
        : 'mb-3 border-b border-secondary-100/20 pb-2',
      
      title: isAdminUser 
        ? 'text-sm py-2 font-semibold mb-2 text-secondary-100'
        : 'text-sm font-semibold mb-1',
      
      fieldLabel: isAdminUser 
        ? 'text-secondary-300 font-medium text-xs'
        : 'text-secondary-400/80',
      
      fieldValue: isAdminUser 
        ? 'text-secondary-300'
        : 'font-medium',
      
      profileImage: isAdminUser 
        ? 'brightness-0 saturate-1000 invert-90 bg-secondary-200/30 p-2 rounded-lg linear-gradient-to-br from-secondary-200/30 to-secondary-200/10'
        : 'bg-gray-200 border border-gray-300 p-2', 
      
      adminButton: isAdminUser 
        ? 'w-full text-left px-2 py-1.5 rounded bg-primary-500/40 text-secondary-100 hover:bg-primary-400/80 hover:text-primary-900/80 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-300/70 font-medium'
        : 'w-full text-left px-2 py-1.5 rounded hover:bg-secondary-200 text-sm text-secondary-600 hover:text-secondary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-secondary-300/70 font-medium',
      
      logoutButton: isAdminUser 
        ? 'w-full text-left px-2 py-1.5 rounded bg-danger-500/40 text-secondary-100 hover:bg-danger-300/80 hover:text-danger-900/80 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary-300/70 font-medium'
        : 'w-full text-left px-2 py-1.5 rounded hover:bg-danger-100 text-sm text-danger-600 disabled:opacity-60'
    };
  }, [isAdmin, showAdminPortal]);
};

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

  // 스타일 훅 사용
  const styles = useUserProfileStyles(isAdmin, showAdminPortal);
  const isAdminUser = isAdmin && showAdminPortal;

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
      className={[styles.trigger, className].filter(Boolean).join(' ')}
      profileTitle={isAdminUser ? undefined : userProfile?.name}
      profileDescription={isAdminUser ? undefined : userProfile?.department}
      profileImage={undefined}
      profileImageClassName={styles.profileImage}  
      profileTitleClassName={styles.title}
      profileDescriptionClassName={styles.fieldLabel}
      dropdownContentClassName={[styles.dropdown].filter(Boolean).join(' ')}
    >
      <div className={`${panelWidthClass} p-2`}>
        <div className={styles.infoSection}>
          <p className={styles.title}>
            {isAdminUser ? '관리자 정보' : '내 정보'}
          </p>
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
                <span className={styles.fieldLabel}>이름</span>
                <span className={`${styles.fieldValue} truncate max-w-[60%] ${valueAlignCls}`}>
                  {userProfile?.name || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={styles.fieldLabel}>부서</span>
                <span className={`${styles.fieldValue} truncate max-w-[60%] ${valueAlignCls}`}>
                  {userProfile?.department || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={styles.fieldLabel}>연락처</span>
                <span className={`${styles.fieldValue} truncate max-w-[60%] ${valueAlignCls}`}>
                  {userProfile?.phoneNumber || '-'}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {isAdminUser && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className={styles.adminButton}
            >
              관리자 페이지로 이동
            </button>
          )}
          <button
            type="button"
            disabled={isSigningOut}
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            {isSigningOut ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
      </div>
    </Profile>
  );
};

export default UserProfile;
