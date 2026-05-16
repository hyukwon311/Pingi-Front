/**
 * @file ProfileCard.tsx - 홈 화면 내 프로필 요약 카드
 *
 * 사용자의 닉네임 이니셜, 평균 취도 레벨, 총 참여 횟수를 요약 표시한다.
 * "보기" 버튼 클릭 시 마이페이지로 이동한다.
 *
 * @param nickname - 사용자 닉네임
 * @param avgLevel - 평균 취도 레벨
 * @param totalCount - 총 참여 횟수
 */
import { useNavigate } from 'react-router-dom'

interface ProfileCardProps {
  nickname: string
  avgLevel: number
  totalCount: number
}

export default function ProfileCard({ nickname, avgLevel, totalCount }: ProfileCardProps) {
  const navigate = useNavigate()

  return (
    <div className="mx-5 bg-white rounded-2xl px-7 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pingi-50 flex items-center justify-center text-[15px] font-bold text-pingi-600">
            {nickname.charAt(0)}
          </div>
          <div>
            <p className="text-[15px] font-bold text-grey-900">내 취도 프로필</p>
            <p className="text-[13px] text-grey-500 mt-0.5">
              평균 Lv.{avgLevel} · {totalCount}회 참여
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/mypage')}
          className="px-4 py-2 rounded-xl bg-grey-100 text-grey-700 text-[13px] font-semibold active:bg-grey-200 transition-colors"
        >
          보기
        </button>
      </div>
    </div>
  )
}
