/**
 * @file WaitingRoom.tsx - 대기실 페이지
 *
 * 세션 생성/참가 후, 모든 참가자가 baseline 측정을 완료할 때까지 대기하는 화면.
 * - 참가자 목록과 각자의 baseline 측정 상태(측정 완료/대기 중)를 표시
 * - baseline 미완료 참가자는 "발음 측정하기" 버튼으로 측정 페이지 이동
 * - 방장은 모든 참가자가 측정 완료되면 "시작하기" 가능
 * - 상단에 세션 초대 코드를 표시하여 추가 초대 가능
 * - 5초 간격 폴링으로 참가자 목록 및 상태를 자동 갱신
 */
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSession } from '@/hooks/useSession'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import PageTransition from '@/components/layout/PageTransition'

export default function WaitingRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { session, setSession } = useSession()

  useEffect(() => {
    if (session) return
    // TODO: sessionApi.get(id) + usePolling으로 교체
    setSession({
      id: id ?? '',
      name: '금요 회식',
      hostId: user?.id ?? '1',
      inviteCode: 'ABC123',
      status: 'waiting',
      participants: [
        { user: { id: user?.id ?? '1', nickname: user?.nickname ?? '나' }, drunkLevel: 0, drinkCount: 0, baselineCompleted: true, levelHistory: [] },
        { user: { id: '2', nickname: '홍길동' }, drunkLevel: 0, drinkCount: 0, baselineCompleted: true, levelHistory: [] },
        { user: { id: '3', nickname: '고길동' }, drunkLevel: 0, drinkCount: 0, baselineCompleted: true, levelHistory: [] },
      ],
      createdAt: Date.now(),
    })
  }, [id, session, setSession, user])

  const participants = session?.participants ?? []
  const isHost = session?.hostId === user?.id
  const allReady = participants.length > 0 && participants.every((p) => p.baselineCompleted)
  const myBaseline = participants.find((p) => p.user.id === user?.id)?.baselineCompleted ?? false

  return (
    <PageTransition>
      <Header title="대기실" showBack />
      <div className="flex-1 px-5 py-6 flex flex-col gap-6">
        <div className="text-center pt-2">
          <p className="text-[13px] text-grey-500">세션 코드</p>
          <p className="text-[20px] font-bold text-pingi-500 tracking-[0.15em] mt-2">
            {session?.inviteCode ?? '------'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[15px] font-bold text-grey-900">
            참가자 <span className="text-grey-500 font-medium">{participants.length}명</span>
          </p>
          <div className="flex flex-col gap-3">
            {participants.map((p) => (
              <Card key={p.user.id} padding="md" className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-pingi-50 flex items-center justify-center text-[14px] font-bold text-pingi-600">
                    {p.user.nickname.charAt(0)}
                  </div>
                  <span className="text-[15px] font-medium text-grey-900">
                    {p.user.nickname}
                    {p.user.id === user?.id && (
                      <span className="ml-1.5 text-[12px] text-pingi-500 font-medium">(나)</span>
                    )}
                  </span>
                </div>
                <Badge variant={p.baselineCompleted ? 'success' : 'default'}>
                  {p.baselineCompleted ? '측정 완료' : '대기 중'}
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-auto pb-6 flex flex-col gap-3">
          {!myBaseline && (
            <Button fullWidth size="lg" onClick={() => navigate(`/session/${id}/baseline`)}>
              발음 측정하기
            </Button>
          )}
          {myBaseline && !isHost && (
            <Button fullWidth size="lg" variant="secondary" disabled>
              다른 참가자를 기다리는 중...
            </Button>
          )}
          {isHost && (
            <Button
              fullWidth
              size="lg"
              disabled={!allReady}
              onClick={() => navigate(`/session/${id}`)}
            >
              {allReady ? '시작하기' : `측정 완료 대기 중 (${participants.filter((p) => p.baselineCompleted).length}/${participants.length})`}
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
