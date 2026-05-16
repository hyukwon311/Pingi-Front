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

      <div className="mt-4 pt-4 border-t border-grey-100 flex items-center justify-between">
        <span className="text-[14px] text-grey-600">할 일</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pingi-500" />
          <span className="text-[14px] text-grey-900 font-medium">초대코드 확인하기</span>
        </div>
      </div>
    </div>
  )
}
