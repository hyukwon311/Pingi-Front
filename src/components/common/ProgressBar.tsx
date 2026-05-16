/**
 * @file ProgressBar.tsx - 진행 바 컴포넌트
 *
 * 녹음 진행, 로딩 등에 사용하는 프로그레스 바.
 */

interface ProgressBarProps {
  percent: number
  color?: 'ink' | 'success'
}

export default function ProgressBar({ percent, color = 'ink' }: ProgressBarProps) {
  const bgColor = color === 'ink' ? 'bg-ink' : 'bg-success'
  const clampedPercent = Math.min(100, Math.max(0, percent))

  return (
    <div className="h-1.5 bg-grid rounded-full overflow-hidden">
      <div
        className={`h-full ${bgColor} rounded-full transition-all duration-300`}
        style={{ width: `${clampedPercent}%` }}
      />
    </div>
  )
}
