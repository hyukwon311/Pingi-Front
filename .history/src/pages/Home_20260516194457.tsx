import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Card from '@/components/common/Card'
import PageTransition from '@/components/layout/PageTransition'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [inviteCode, setInviteCode] = useState('')

  const handleJoin = () => {
    if (inviteCode.trim()) {
      navigate(`/session/join?code=${inviteCode.trim()}`)
    }
  }

  return (
    <PageTransition>
      <Header
        title="핑이"
        right={
          <div className="w-9 h-9 rounded-full bg-pingi-50 flex items-center justify-center text-[13px] font-bold text-pingi-600">
            {user?.nickname.charAt(0)}
          </div>
        }
      />
      <div className="flex-1 px-6 pb-10 flex flex-col gap-8">
        <div className="text-center pt-6 pb-2">
          <p className="text-grey-500 text-[14px]">안녕하세요, {user?.nickname}님</p>
          <h2 className="text-[22px] font-bold text-grey-900 mt-1.5">
            오늘 술자리 있으세요?
          </h2>
        </div>

        <Button fullWidth size="lg" onClick={() => navigate('/session/create')}>
          술자리 시작하기
        </Button>

        <div className="flex flex-col gap-4">
          <p className="text-[15px] font-bold text-grey-900">초대 받으셨나요?</p>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <Input
                placeholder="초대 코드 입력"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={handleJoin}
              disabled={!inviteCode.trim()}
              className="shrink-0 mt-px"
            >
              참가
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[15px] font-bold text-grey-900">지난 세션</p>
          <Card className="text-center py-10">
            <p className="text-[14px] text-grey-400">아직 세션 기록이 없어요</p>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
