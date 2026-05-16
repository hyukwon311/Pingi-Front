/**
 * @file SessionDashboard.tsx - 세션 대시보드 (술자리 진행 중 화면)
 *
 * 술자리가 진행되는 동안 표시되는 메인 화면으로, 다음을 포함한다:
 * - 다음 발음 테스트까지의 카운트다운 타이머 (30분 간격)
 * - 참가자별 취도 레벨, 음주량, 변화 그래프 (ParticipantCard)
 * - 수동 발음 테스트 이동 버튼
 * - 세션 종료 버튼
 *
 * 타이머가 0이 되면 자동으로 발음 테스트 녹음 페이지로 이동한다.
 */
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTimer } from '@/hooks/useTimer'
import { TEST_INTERVAL_MS } from '@/constants/levels'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import Timer from '@/components/common/Timer'
import ParticipantCard from '@/components/session/ParticipantCard'
import PageTransition from '@/components/layout/PageTransition'
import type { Participant } from '@/types/session'

/** TODO: API 연동 후 제거할 더미 참가자 데이터 */
const mockParticipants: Participant[] = [
  {
    user: { id: '1', nickname: '나' },
    drunkLevel: 1,
    drinkCount: 0,
    baselineCompleted: true,
    levelHistory: [{ timestamp: Date.now(), level: 1 }],
  },
  {
    user: { id: '2', nickname: '친구1' },
    drunkLevel: 2,
    drinkCount: 3,
    baselineCompleted: true,
    levelHistory: [
      { timestamp: Date.now() - 1800000, level: 1 },
      { timestamp: Date.now(), level: 2 },
    ],
  },
  {
    user: { id: '3', nickname: '친구2' },
    drunkLevel: 3,
    drinkCount: 5,
    baselineCompleted: true,
    levelHistory: [
      { timestamp: Date.now() - 3600000, level: 1 },
      { timestamp: Date.now() - 1800000, level: 2 },
      { timestamp: Date.now(), level: 3 },
    ],
  },
]

export default function SessionDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { remaining } = useTimer({
    durationMs: TEST_INTERVAL_MS,
    autoStart: true,
    onComplete: () => navigate(`/session/${id}/record`),
  })

  return (
    <PageTransition>
      <Header title="술자리 진행 중" showBack />
      <div className="flex-1 px-5 py-5 flex flex-col gap-4">
        <div className="flex items-center justify-center py-5 bg-white rounded-2xl">
          <Timer remainingMs={remaining} label="다음 발음 테스트까지" />
        </div>

        <div className="flex flex-col gap-3">
          {mockParticipants.map((p) => (
            <ParticipantCard
              key={p.user.id}
              participant={p}
              isMe={p.user.id === '1'}
              onDrinkIncrement={p.user.id === '1' ? () => {} : undefined}
              onDrinkDecrement={p.user.id === '1' ? () => {} : undefined}
            />
          ))}
        </div>

        <div className="mt-auto pb-6 flex gap-3">
          <Button
            fullWidth
            variant="secondary"
            onClick={() => navigate(`/session/${id}/record`)}
          >
            발음 테스트
          </Button>
          <Button
            fullWidth
            variant="danger"
            onClick={() => navigate(`/session/${id}/result`)}
          >
            세션 종료
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
