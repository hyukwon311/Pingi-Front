/**
 * @file AlertBanner.tsx - 초대 코드 입장 안내 배너
 *
 * 홈 화면 상단에 표시되는 배너로, 초대를 받은 사용자에게
 * 초대 코드를 입력하여 세션에 참가하도록 안내한다.
 * X 버튼으로 배너를 숨길 수 있다.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AlertBanner() {
  const [dismissed, setDismissed] = useState(false)
  const navigate = useNavigate()

  if (dismissed) return null

  return (
    <div className="mx-5 mt-2 px-5 py-4 bg-gradient-to-r from-pingi-50 to-white rounded-2xl flex items-center gap-3.5">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="3" stroke="var(--color-pingi-500)" strokeWidth="1.8" />
          <path d="M2 8l8.9 5.2a2 2 0 002.2 0L22 8" stroke="var(--color-pingi-500)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <button
        onClick={() => navigate('/session/join')}
        className="flex-1 min-w-0 text-left"
      >
        <p className="text-[14px] font-bold text-grey-900">초대를 받으셨나요?</p>
        <p className="text-[12.5px] text-grey-500 mt-0.5">초대 코드를 입력하고 술자리에 참가하세요</p>
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-grey-400 active:bg-grey-100 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
