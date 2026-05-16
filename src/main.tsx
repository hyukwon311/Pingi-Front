/**
 * @file main.tsx - 애플리케이션 진입점 (Entry Point)
 *
 * React 앱을 DOM에 마운트하는 최상위 파일.
 * StrictMode로 개발 시 잠재적 문제를 감지하고,
 * BrowserRouter로 클라이언트 사이드 라우팅을 활성화한다.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
