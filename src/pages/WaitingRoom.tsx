/**
 * @file WaitingRoom.tsx - 대기실 페이지
 *
 * 세션 생성/참가 후, 모든 참가자가 준비 완료할 때까지 대기하는 화면.
 * - 참가자 목록과 각자의 준비 상태(준비 완료/대기 중)를 표시
 * - 방장(isHost)은 모든 참가자가 준비 완료되면 "시작하기" 가능
 * - 일반 참가자는 "준비 완료/취소" 토글 가능
 * - 상단에 세션 초대 코드를 표시하여 추가 초대 가능
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import PageTransition from '@/components/layout/PageTransition'

interface WaitingParticipant {
  id: string
  nickname: string
  isReady: boolean
}

export default function WaitingRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isReady, setIsReady] = useState(false)

  const participants: WaitingParticipant[] = [
    { id: user?.id ?? '1', nickname: user?.nickname ?? '나', isReady },
    { id: '2', nickname: '참가자2', isReady: true },
    { id: '3', nickname: '참가자3', isReady: false },
  ]

  const isHost = true
  const allReady = participants.every((p) => p.isReady)

  return (
    <PageTransition>
      <Header title="대기실" showBack />
      <div className="flex-1 px-5 py-6 flex flex-col gap-6">
        <div className="text-center pt-2">
          <p className="text-[13px] text-grey-500">세션 코드</p>
          <p className="text-[20px] font-bold text-pingi-500 tracking-[0.15em] mt-2">ABC123</p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[15px] font-bold text-grey-900">
            참가자 <span className="text-grey-500 font-medium">{participants.length}명</span>
          </p>
          <div className="flex flex-col gap-3">
            {participants.map((p) => (
              <Card key={p.id} padding="md" className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-pingi-50 flex items-center justify-center text-[14px] font-bold text-pingi-600">
                    {p.nickname.charAt(0)}
                  </div>
                  <span className="text-[15px] font-medium text-grey-900">
                    {p.nickname}
                    {p.id === user?.id && (
                      <span className="ml-1.5 text-[12px] text-pingi-500 font-medium">(나)</span>
                    )}
                  </span>
                </div>
                <Badge variant={p.isReady ? 'success' : 'default'}>
                  {p.isReady ? '준비 완료' : '대기 중'}
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-auto pb-6 flex flex-col gap-3">
          {isHost ? (
            <Button fullWidth size="lg" disabled={!allReady} onClick={() => navigate(`/session/${id}/baseline`)}>
              시작하기
            </Button>
          ) : (
            <Button
              fullWidth
              size="lg"
              variant={isReady ? 'secondary' : 'primary'}
              onClick={() => setIsReady(!isReady)}
            >
              {isReady ? '준비 취소' : '준비 완료'}
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
