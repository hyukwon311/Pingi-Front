/**
 * @file AlertBanner.tsx - 진행 중인 세션 알림 배너
 *
 * 홈 화면 상단에 표시되는 배너로, 현재 진행 중인 술자리가 있을 때
 * "술자리 진행 중이에요" 메시지와 함께 세션 입장 버튼을 보여준다.
 * X 버튼으로 배너를 숨길 수 있다.
 *
 * @param sessionId - 진행 중인 세션 ID (없으면 배너 미표시)
 * @param sessionName - 세션 이름
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface AlertBannerProps {
  sessionId?: string
  sessionName?: string
}

export default function AlertBanner({ sessionId, sessionName }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()

  if (dismissed || !sessionId) return null

  return (
    <div className="mx-5 mt-2 px-7 py-6 bg-white rounded-2xl flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-pingi-50 flex items-center justify-center shrink-0">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4" stroke="var(--color-pingi-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="10" stroke="var(--color-pingi-500)" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-grey-500">술자리 진행 중이에요</p>
        <button
          onClick={() => navigate(`/session/${sessionId}`)}
          className="text-[16px] font-bold text-pingi-600 mt-0.5"
        >
          {sessionName || '진행 중인 세션'} 입장하기
        </button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-grey-400 active:bg-grey-100 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
