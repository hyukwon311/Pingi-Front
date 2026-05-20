/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 백엔드 REST API base URL (예: http://localhost:8000/v1, /v1) */
  readonly VITE_API_URL: string
  /** Socket.io 연결 base URL (예: http://localhost:8000, 빈 값이면 window.location.origin) */
  readonly VITE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
