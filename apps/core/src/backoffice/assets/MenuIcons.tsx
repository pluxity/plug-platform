export const FacilityIcon = ({ className }: { className?: string }) => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" fill="currentColor"
    className={className} aria-hidden
  >
    <rect x="5" y="3" width="14" height="18" rx="2" opacity="0.35" />
    <rect x="9" y="7" width="2" height="2" rx="1" />
    <rect x="13" y="7" width="2" height="2" rx="1" />
    <rect x="11" y="11" width="2" height="2" rx="1" />
    <rect x="10" y="15" width="4" height="6" rx="1" />
  </svg>
);

export const AssetIcon = ({ className }: { className?: string }) => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" fill="currentColor"
    className={className} aria-hidden
  >
    <path
      opacity="0.35"
      d="M12 3 L18 6.5 V13.5 L12 17 L6 13.5 V6.5 L12 3 Z"
    />
    <rect x="11" y="6.5" width="2" height="7" rx="1" />
  </svg>
);

export const DeviceIcon = ({ className }: { className?: string }) => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" fill="currentColor"
    className={className} aria-hidden
  >
    <rect x="5" y="7" width="14" height="10" rx="2" opacity="0.35" />
    <rect x="8" y="5" width="8" height="2" rx="1" />
    <circle cx="10" cy="12" r="1.25" />
    <circle cx="14" cy="12" r="1.25" />
  </svg>
);

export const CCTVIcon = ({ className }: { className?: string }) => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg" fill="currentColor"
    className={className} aria-hidden
  >
    <path
      opacity="0.35"
      d="M4 9 H16 L18 12 H6 L4 9 Z"
    />
    <circle cx="14.5" cy="10.5" r="1.5" />
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

