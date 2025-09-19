import * as React from "react";

type Props = React.SVGProps<SVGSVGElement>;

export default function Profile({ className }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect opacity="0.01" width="24" height="24" fill="black" />
      <path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        fill="#528DE8"
      />
      <path
        d="M18.8571 21C19.4883 21 20 20.4404 20 19.75C20 14.9175 16.4183 11 12 11C7.58172 11 4 14.9175 4 19.75C4 20.4404 4.51167 21 5.14286 21H18.8571Z"
        fill="#528DE8"
      />
    </svg>
  );
}