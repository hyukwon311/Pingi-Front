/**
 * @file BottomTabBar.tsx - 하단 탭 바 네비게이션
 *
 * 홈, 기록, 마이페이지 간 전환을 위한 하단 고정 탭 바.
 * 현재 경로(pathname)에 따라 활성 탭의 아이콘이 채워진(filled) 형태로 바뀐다.
 * safe-area-inset-bottom을 적용하여 노치/홈 인디케이터 영역을 확보한다.
 */
import { useLocation, useNavigate } from 'react-router-dom'

/** 탭 정의: 경로, 라벨, 활성/비활성 아이콘 */
const tabs = [
  {
    path: '/history',
    label: '기록',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {active ? (
          <>
            <circle cx="12" cy="12" r="9" fill="currentColor" />
            <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
    ),
  },
  {
    path: '/home',
    label: '홈',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {active ? (
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" fill="currentColor" />
        ) : (
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        )}
      </svg>
    ),
  },
  {
    path: '/mypage',
    label: '마이',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {active ? (
          <>
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 21c0-3.866 3.582-7 8-7s8 3.134 8 7" fill="currentColor" />
          </>
        ) : (
          <>
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M4 21c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}
      </svg>
    ),
  },
] as const

export default function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white border-t border-grey-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-[56px]">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-grey-900' : 'text-grey-400'
              }`}
            >
              {tab.icon(isActive)}
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
