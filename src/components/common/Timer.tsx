/**
 * @file Timer.tsx - 카운트다운 타이머 표시 컴포넌트
 *
 * 남은 시간을 "MM:SS" 형태로 크게 표시한다.
 * 1분 미만이 되면 빨간색 + 깜빡이는 애니메이션으로 긴급함을 표현한다.
 *
 * @param remainingMs - 남은 시간 (밀리초)
 * @param label - 타이머 위에 표시할 설명 (예: "다음 발음 테스트까지")
 */
import { formatCountdown } from '@/utils/formatTime'

interface TimerProps {
  remainingMs: number
  label?: string
}

export default function Timer({ remainingMs, label }: TimerProps) {
  const isUrgent = remainingMs < 60_000

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && <span className="text-[13px] text-grey-500">{label}</span>}
      <span
        className={`text-[28px] font-bold tabular-nums tracking-tight ${isUrgent ? 'text-status-danger animate-pulse-soft' : 'text-pingi-500'}`}
      >
        {formatCountdown(remainingMs)}
      </span>
    </div>
  )
}
