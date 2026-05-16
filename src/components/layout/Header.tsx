/**
 * @file Header.tsx - 페이지 상단 헤더 컴포넌트
 *
 * 두 가지 형태를 지원한다:
 * - 'home': 홈 화면용 (왼쪽 타이틀, 오른쪽 액션 영역)
 * - 'sub': 서브 페이지용 (뒤로가기 버튼, 가운데 타이틀, 오른쪽 액션 영역)
 *
 * @param variant - 'home' | 'sub' (기본값: 'sub')
 * @param title - 헤더에 표시할 제목
 * @param showBack - 뒤로가기 버튼 표시 여부 (sub에서만 유효)
 * @param right - 오른쪽 영역에 렌더링할 React 노드
 */
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  variant?: 'home' | 'sub'
  title?: string
  showBack?: boolean
  right?: React.ReactNode
}

export default function Header({ variant = 'sub', title, showBack = false, right }: HeaderProps) {
  const navigate = useNavigate()

  if (variant === 'home') {
    return (
      <header className="sticky top-0 z-40 flex items-center justify-between h-[56px] px-6 bg-grey-100/80 backdrop-blur-xl">
        <h1 className="text-[20px] font-bold text-grey-900">{title}</h1>
        <div className="flex items-center gap-2">{right}</div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-[56px] px-6 bg-grey-100/80 backdrop-blur-xl">
      <div className="w-10">
        {showBack && (
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 -ml-2 rounded-xl active:bg-grey-200 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {title && <h1 className="text-[17px] font-bold text-grey-900">{title}</h1>}
      <div className="w-10 flex justify-end">{right}</div>
    </header>
  )
}
