/**
 * @file AppLayout.tsx - 최상위 앱 레이아웃
 *
 * 핑이 앱의 최상위 레이아웃 컴포넌트로, 모든 페이지를 감싸는 공통 레이아웃을 제공한다.
 * 배경에는 종이 질감의 그리드 패턴(bg-paper-grid)이 적용되며,
 * 상단에는 고정된 헤더가 표시되어 핑이 로고를 클릭하면 홈 화면으로 이동할 수 있다.
 * 단, 메인 홈 화면(경로 "/")에서는 헤더를 숨겨 로고가 중앙에 크게 표시되도록 한다.
 * React Router의 Outlet을 통해 하위 페이지 컴포넌트를 렌더링하며,
 * 앱 전체의 일관된 룩앤필을 유지하는 역할을 한다.
 */
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  return (
    <div className="flex flex-col min-h-dvh bg-paper-grid">
      {!isHome && (
        <header className="sticky top-0 z-50 px-4 py-3 bg-paper/80 backdrop-blur-sm">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <img src="/logo.png" alt="핑이" className="w-7 h-7 object-contain" />
            <span className="font-display text-ink text-base leading-none pt-0.5">핑이</span>
          </button>
        </header>
      )}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
