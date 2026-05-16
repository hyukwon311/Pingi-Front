/**
 * @file JoinSession.tsx - 세션 참가 페이지
 *
 * 방장에게 받은 6자리 초대 코드를 입력하여 세션에 참가하는 화면.
 * URL 쿼리 파라미터(?code=...)로 코드가 전달될 수도 있다.
 * 코드가 6자리 채워지면 "참가하기" 버튼이 활성화된다.
 */
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import PageTransition from '@/components/layout/PageTransition'

export default function JoinSession() {
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState(searchParams.get('code') ?? '')
  const navigate = useNavigate()

  const handleJoin = () => {
    if (!code.trim()) return
    navigate(`/session/demo/waiting`)
  }

  return (
    <PageTransition>
      <Header title="세션 참가" showBack />
      <div className="flex-1 px-5 py-6 flex flex-col gap-6">
        <div className="text-center pt-4 pb-2">
          <h2 className="text-[22px] font-bold text-grey-900">초대 코드를 입력하세요</h2>
          <p className="text-[14px] text-grey-500 mt-2.5 leading-relaxed">
            방장에게 받은 6자리 코드를 입력해주세요
          </p>
        </div>

        <Input
          placeholder="초대 코드"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          className="text-center text-[24px] tracking-[0.3em] font-bold py-5"
          autoFocus
        />

        <div className="mt-auto pb-6">
          <Button fullWidth size="lg" onClick={handleJoin} disabled={code.length < 6}>
            참가하기
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
