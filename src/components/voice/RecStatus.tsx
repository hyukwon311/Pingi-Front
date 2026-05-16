/**
 * @file RecStatus.tsx - 녹음 상태 표시 컴포넌트
 *
 * 깜빡이는 빨간 점 + 현재 녹음 시간 표시
 *
 * @param seconds - 현재 녹음 시간 (초)
 * @param total - 전체 녹음 시간 (초, 기본: 5)
 */

interface RecStatusProps {
  seconds: number
  total?: number
}

export default function RecStatus({ seconds, total = 5 }: RecStatusProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 text-sm text-brown-900">
      <span className="w-3.5 h-3.5 rounded-full bg-ink animate-blink-rec" />
      <span>
        <strong>{seconds}초</strong> / {total}초
      </span>
    </div>
  )
}
