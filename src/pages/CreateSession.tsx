/**
 * @file CreateSession.tsx - 새 술자리 만들기 페이지
 *
 * 세션 이름을 입력하고, 자동 생성된 초대 코드를 확인/복사하여
 * 친구들에게 공유한 뒤 "방 만들기"로 대기실을 생성하는 화면.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Card from '@/components/common/Card'
import PageTransition from '@/components/layout/PageTransition'

/** 6자리 랜덤 영문+숫자 초대 코드를 생성한다 */
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function CreateSession() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [inviteCode] = useState(generateCode)
  const [copied, setCopied] = useState(false)

  /** 세션 이름 유효성 확인 후 대기실로 이동 */
  const handleCreate = () => {
    if (!name.trim()) return
    navigate(`/session/demo/waiting`)
  }

  /** 초대 코드를 클립보드에 복사하고 2초간 "복사됨!" 표시 */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <PageTransition>
      <Header title="술자리 만들기" showBack />
      <div className="flex-1 px-5 py-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <p className="text-[15px] font-semibold text-grey-900 pl-0.5">세션 이름</p>
          <input
            placeholder="예: 금요일 회식"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoFocus
            className="w-full h-[52px] px-4 rounded-2xl border-none bg-white text-grey-900 text-[16px] placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-pingi-500/20 transition-all"
          />
        </div>

        <Card padding="lg" className="flex flex-col gap-5">
          <p className="text-[15px] font-bold text-grey-900">초대 코드</p>
          <div className="flex items-center gap-4 py-1">
            <span className="flex-1 text-[28px] font-bold text-pingi-500 tracking-[0.15em] text-center">
              {inviteCode}
            </span>
            <button
              onClick={handleCopy}
              className="shrink-0 h-[40px] px-4 rounded-xl bg-pingi-50 text-pingi-600 text-[14px] font-semibold active:bg-pingi-100 transition-all"
            >
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>
          <p className="text-[13px] text-grey-400 text-center">
            친구들에게 이 코드를 공유하세요
          </p>
        </Card>

        <div className="mt-auto pb-6">
          <Button fullWidth size="lg" onClick={handleCreate} disabled={!name.trim()}>
            방 만들기
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
