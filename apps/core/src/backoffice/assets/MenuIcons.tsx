export const FacilityIcon = ({ className }: { className?: string }) => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" fill="currentColor"
    className={className} aria-hidden
  >
    {/* 건물 본체 */}
    <rect x="5" y="3" width="14" height="18" rx="2" opacity="0.35" />
    {/* 창문(포인트) */}
    <rect x="9" y="7" width="2" height="2" rx="1" />
    <rect x="13" y="7" width="2" height="2" rx="1" />
    <rect x="11" y="11" width="2" height="2" rx="1" />
    {/* 문 */}
    <rect x="10" y="15" width="4" height="6" rx="1" />
  </svg>
);

// 2) Asset (육각형 + 중앙 세로선)
export const AssetIcon = ({ className }: { className?: string }) => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" fill="currentColor"
    className={className} aria-hidden
  >
    {/* 육각형 본체 */}
    <path
      opacity="0.35"
      d="M12 3 L18 6.5 V13.5 L12 17 L6 13.5 V6.5 L12 3 Z"
    />
    {/* 중앙 세로선(굵은 fill) */}
    <rect x="11" y="6.5" width="2" height="7" rx="1" />
  </svg>
);

// 3) Device (장비 느낌: 본체 + 상단 핸들/베젤 + 포트 2개)
export const DeviceIcon = ({ className }: { className?: string }) => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" fill="currentColor"
    className={className} aria-hidden
  >
    {/* 본체 */}
    <rect x="5" y="7" width="14" height="10" rx="2" opacity="0.35" />
    {/* 상단 핸들/베젤 */}
    <rect x="8" y="5" width="8" height="2" rx="1" />
    {/* 포트(점) */}
    <circle cx="10" cy="12" r="1.25" />
    <circle cx="14" cy="12" r="1.25" />
  </svg>
);

// 4) CCTV (카메라 바디 + 렌즈 + 브라켓/암)
export const CCTVIcon = ({ className }: { className?: string }) => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" fill="currentColor"
    className={className} aria-hidden
  >
    {/* 카메라 바디(약간의 사다리꼴) */}
    <path
      opacity="0.35"
      d="M4 9 H16 L18 12 H6 L4 9 Z"
    />
    {/* 렌즈 */}
    <circle cx="14.5" cy="10.5" r="1.5" />
    {/* 브라켓/암 */}
    <rect x="8" y="12.5" width="2" height="4" rx="1" />
    <rect x="9" y="16" width="5" height="2" rx="1" />
  </svg>
);

export const UserIcon = ({ className }: { className?: string }) => (
    <svg
        width="24" height="24" viewBox="0 0 24 24"
        fill="currentColor" xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle opacity="0.35" cx="12" cy="8" r="4" />
        <path d="M12 13c-3.3 0-6 2.2-6 5v1h12v-1c0-2.8-2.7-5-6-5z" />
    </svg>
);

