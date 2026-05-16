/**
 * @file Header.tsx - 페이지 상단 헤더 컴포넌트
 *
 * 서브 페이지용 헤더 (뒤로가기 버튼, 가운데 타이틀).
 * 배경은 투명 (격자 배경 비침).
 */
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  title?: string
  showBack?: boolean
  right?: React.ReactNode
}

export default function Header({ title, showBack = false, right }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-5 bg-paper/80 backdrop-blur-sm">
      <div className="w-10">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-xl text-brown-500 active:bg-brown-300/20 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      {title && (
        <h1 className="font-display text-lg text-brown-900">{title}</h1>
      )}
      <div className="w-10 flex justify-end">{right}</div>
    </header>
  )
}
