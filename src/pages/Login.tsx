/**
 * @file Login.tsx - 로그인(닉네임 입력) 페이지
 *
 * 사용자가 닉네임을 입력하여 간편 로그인하는 화면.
 * 별도의 계정 시스템 없이 닉네임만으로 사용자를 생성하며,
 * crypto.randomUUID()로 고유 ID를 발급한다.
 * 로그인 성공 시 홈 화면으로 이동한다.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import PageTransition from '@/components/layout/PageTransition'

export default function Login() {
  const [nickname, setNickname] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  /** 폼 제출: UUID를 생성하고 AuthContext에 로그인 처리 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim()) return

    login({
      id: crypto.randomUUID(),
      nickname: nickname.trim(),
    })
    navigate('/home', { replace: true })
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-dvh bg-white px-6">
        <div className="flex-1 flex flex-col justify-center gap-10">
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl">🍻</span>
            <h1 className="text-[24px] font-bold text-grey-900 mt-2">
              핑이에 오신 걸 환영해요
            </h1>
            <p className="text-[15px] text-grey-500 text-center leading-relaxed">
              닉네임을 입력하고 술자리를 시작해보세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="닉네임"
              placeholder="어떻게 불러드릴까요?"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={10}
              autoFocus
              className="bg-grey-100"
            />
            <Button type="submit" fullWidth size="lg" disabled={!nickname.trim()}>
              시작하기
            </Button>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
