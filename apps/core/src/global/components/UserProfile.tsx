import { useNavigate } from 'react-router-dom';

import React, { useEffect, useState, useCallback } from 'react';

import type { UserProfile as UserProfileType  } from '@plug/common-services';
import { useSignOut, getUserProfile } from '@plug/common-services/services';
import { Profile } from '@plug/ui';

import { useAuthStore } from '@/global/store';
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
      className={["space-x-0 transition [&>div:last-child]:hidden", className]
        .filter(Boolean)
        .join(" ")}
      profileTitle={userProfile?.name || "사용자"}
      profileDescription={userProfile?.department || "부서"}
      profileImage={undefined}
    >
      <div className={`${panelWidthClass}`}>
        <div className="border-b p-2">
          <div className="flex items-center gap-2.5 mb-2 p-2 bg-primary-100 rounded-md">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.16675 14.6667V13.8333C2.16675 13.0673 2.31763 12.3087 2.61078 11.601C2.90394 10.8933 3.33362 10.2502 3.87529 9.70854C4.41697 9.16687 5.06003 8.73719 5.76776 8.44404C6.47549 8.15088 7.23404 8 8.00008 8C8.76613 8 9.52467 8.15088 10.2324 8.44404C10.9401 8.73719 11.5832 9.16687 12.1249 9.70854C12.6665 10.2502 13.0962 10.8933 13.3894 11.601C13.6825 12.3087 13.8334 13.0673 13.8334 13.8333V14.6667"
                stroke="#153A91"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.00008 7.99992C8.88414 7.99992 9.73198 7.64873 10.3571 7.02361C10.9822 6.39849 11.3334 5.55064 11.3334 4.66659C11.3334 3.78253 10.9822 2.93468 10.3571 2.30956C9.73198 1.68444 8.88414 1.33325 8.00008 1.33325C7.11603 1.33325 6.26818 1.68444 5.64306 2.30956C5.01794 2.93468 4.66675 3.78253 4.66675 4.66659C4.66675 5.55064 5.01794 6.39849 5.64306 7.02361C6.26818 7.64873 7.11603 7.99992 8.00008 7.99992V7.99992Z"
                stroke="#153A91"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p className="text-sm font-semibold text-primary-900">내 정보</p>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-4/5" />
              <div className="h-3 bg-gray-200 rounded w-3/5" />
            </div>
          ) : error ? (
            <div className="text-xs text-red-500">{error}</div>
          ) : (
            <div className="text-xs space-y-1 p-1">
              <div className="flex justify-between">
                <span className="text-gray-500">이름</span>
                <span
                  className={`font-medium truncate max-w-[60%] ${valueAlignCls}`}
                >
                  {userProfile?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">부서</span>
                <span className={`truncate max-w-[60%] ${valueAlignCls}`}>
                  {userProfile?.department || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">권한</span>
                <span className={`truncate max-w-[60%] ${valueAlignCls}`}>
                  {userProfile?.roles
                    ? Array.from(userProfile.roles)
                        .map((role) => role.name)
                        .join(", ")
                    : "-"}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 p-2">
          {isAdmin && showAdminPortal && (
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-sky-600 hover:text-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-sky-300/70"
            >
              관리자 페이지로 이동
            </button>
          )}
          <button
            type="button"
            disabled={isSigningOut}
            onClick={handleLogout}
            className="w-full flex gap-2.5 items-center text-left px-2 py-1.5 rounded hover:bg-red-50 text-sm text-danger-700 disabled:opacity-60"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33398 2L6.89228 2.1559C5.1731 2.76267 4.31351 3.06605 3.82375 3.75828C3.33398 4.45051 3.33398 5.36206 3.33398 7.18518V8.81482C3.33398 10.6379 3.33398 11.5495 3.82375 12.2417C4.31351 12.934 5.1731 13.2373 6.89228 13.8441L7.33398 14"
                stroke="#DC2626"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M14.0007 8.00016L7.33398 8.00016M14.0007 8.00016C14.0007 7.53334 12.6711 6.66118 12.334 6.3335M14.0007 8.00016C14.0007 8.46698 12.6711 9.33914 12.334 9.66683"
                stroke="#DC2626"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {isSigningOut ? "로그아웃 중..." : "로그아웃"}
          </button>
        </div>
      </div>
    </Profile>
  );
};

export default UserProfile;
