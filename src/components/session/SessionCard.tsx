/**
 * @file SessionCard.tsx - 세션 요약 카드 컴포넌트
 *
 * 세션 이름, 참가자 수, 상태 배지를 표시하는 클릭 가능한 카드.
 * 기록 페이지나 목록에서 개별 세션 항목으로 사용된다.
 *
 * @param session - 세션 데이터
 * @param onClick - 카드 클릭 시 호출할 콜백
 */
import Card from '@/components/common/Card'
import Badge from '@/components/common/Badge'
import type { Session } from '@/types/session'

interface SessionCardProps {
  session: Session
  onClick: () => void
}

/** 세션 상태별 배지 라벨 및 색상 variant 매핑 */
const statusMap: Record<Session['status'], { label: string; variant: 'info' | 'success' | 'warning' | 'default' }> = {
  waiting: { label: '대기 중', variant: 'default' },
  baseline: { label: '측정 중', variant: 'info' },
  active: { label: '진행 중', variant: 'success' },
  finished: { label: '종료', variant: 'warning' },
}

export default function SessionCard({ session, onClick }: SessionCardProps) {
  const status = statusMap[session.status]

  return (
    <Card className="cursor-pointer active:scale-[0.98] transition-transform" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-[15px] text-grey-900">{session.name}</p>
          <p className="text-[13px] text-grey-500 mt-1">
            {session.participants.length}명 참가
          </p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
    </Card>
  )
}
