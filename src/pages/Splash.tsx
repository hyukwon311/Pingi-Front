/**
 * @file Splash.tsx - 스플래시(시작) 화면
 *
 * 앱 진입 시 1.8초간 브랜드 로고와 슬로건을 보여주는 화면.
 * 로그인 상태이면 홈으로, 미로그인이면 로그인 화면으로 자동 이동한다.
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Splash() {
  const navigate = useNavigate()
  const { user } = useAuth()

  /** 1.8초 후 로그인 상태에 따라 적절한 페이지로 리다이렉트 */
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(user ? '/home' : '/login', { replace: true })
    }, 1800)
    return () => clearTimeout(timer)
  }, [navigate, user])

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-white">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-24 h-24 rounded-[28px] bg-pingi-50 flex items-center justify-center">
          <span className="text-[44px]">🍻</span>
        </div>
        <h1 className="text-[32px] font-bold text-pingi-600 tracking-tight mt-1">핑이</h1>
        <p className="text-[14px] text-grey-400">발음으로 측정하는 나의 취도</p>
      </div>
    </div>
  )
}
