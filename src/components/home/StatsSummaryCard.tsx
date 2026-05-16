/**
 * @file StatsSummaryCard.tsx - 월간 참여 통계 카드
 *
 * 홈 화면에서 이번 달 술자리 참여 횟수를 요약 표시한다.
 * "내역" 버튼 클릭 시 기록 페이지로 이동한다.
 *
 * @param totalSessions - 이번 달 참여 횟수
 * @param month - 표시할 월 (1~12)
 */
import { useNavigate } from 'react-router-dom'

interface StatsSummaryCardProps {
  totalSessions: number
  month: number
}

export default function StatsSummaryCard({ totalSessions, month }: StatsSummaryCardProps) {
  const navigate = useNavigate()

  return (
    <div className="mx-5 bg-white rounded-2xl px-7 py-7">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[22px] font-bold text-grey-900">{totalSessions}회</p>
          <p className="text-[13px] text-grey-500 mt-1">{month}월에 참여한 술자리</p>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 rounded-xl bg-grey-100 text-grey-700 text-[13px] font-semibold active:bg-grey-200 transition-colors"
        >
          내역
        </button>
      </div>
    </div>
  )
}
