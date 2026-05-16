/**
 * @file AppLayout.tsx - 최상위 앱 레이아웃
 *
 * 모든 페이지를 감싸는 루트 레이아웃 컴포넌트.
 * 최소 높이를 화면 전체(dvh)로 설정하고 회색 배경을 적용한다.
 * <Outlet />으로 하위 라우트의 페이지 컴포넌트가 렌더링된다.
 */
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-dvh bg-grey-100">
      <Outlet />
    </div>
  )
}
