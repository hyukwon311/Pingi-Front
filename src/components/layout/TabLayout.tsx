/**
 * @file TabLayout.tsx - 탭 바 포함 레이아웃
 *
 * 하단 탭 바(BottomTabBar)가 있는 메인 화면(홈, 기록, 마이페이지)의 레이아웃.
 * 탭 바 높이만큼 하단 패딩을 주어 컨텐츠가 탭 바에 가려지지 않도록 한다.
 */
import { Outlet } from 'react-router-dom'
import BottomTabBar from './BottomTabBar'

export default function TabLayout() {
  return (
    <>
      <div className="pb-[calc(56px+env(safe-area-inset-bottom))]">
        <Outlet />
      </div>
      <BottomTabBar />
    </>
  )
}
