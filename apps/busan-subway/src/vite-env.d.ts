/// <reference types="vite/client" />

interface Window {
  env?: {
    API_BASE_URL?: string;
    [key: string]: string | undefined;
  };
} 