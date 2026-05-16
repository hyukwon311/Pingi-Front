/**
 * @file main.tsx - 애플리케이션 진입점 (Entry Point)
 *
 * 핑이 React 앱을 DOM에 마운트하는 최상위 엔트리 파일이다.
 * React 18의 createRoot API를 사용하여 루트를 생성하고,
 * StrictMode로 개발 환경에서 잠재적인 문제를 조기에 감지한다.
 * BrowserRouter를 통해 클라이언트 사이드 라우팅을 활성화하며,
 * index.css에서 Tailwind CSS와 핑이 디자인 시스템 스타일을 불러온다.
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
