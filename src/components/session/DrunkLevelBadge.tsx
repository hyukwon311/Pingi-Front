/**
 * @file DrunkLevelBadge.tsx - 취도 레벨 시각화 배지
 *
 * 5개의 도트(●)와 레벨 텍스트로 취도를 시각적으로 표현한다.
 * 현재 레벨까지의 도트는 색상이 채워지고, 나머지는 회색으로 표시된다.
 * ParticipantCard, SessionResult 등에서 사용된다.
 *
 * @param level - 취도 레벨 (1~5)
 * @param size - 도트 및 텍스트 크기: 'sm' | 'md' | 'lg'
 */
import { DRUNK_LEVELS } from '@/constants/levels'

interface DrunkLevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
}

/** 레벨별 도트 배경색 매핑 */
const levelColorMap: Record<number, string> = {
  1: 'bg-drunk-1',
  2: 'bg-drunk-2',
  3: 'bg-drunk-3',
  4: 'bg-drunk-4',
  5: 'bg-drunk-5',
}

/** 레벨별 텍스트 색상 매핑 */
const textColorMap: Record<number, string> = {
  1: 'text-drunk-1',
  2: 'text-drunk-2',
  3: 'text-drunk-3',
  4: 'text-drunk-4',
  5: 'text-drunk-5',
}

export default function DrunkLevelBadge({ level, size = 'md' }: DrunkLevelBadgeProps) {
  const info = DRUNK_LEVELS[Math.min(level, 5) - 1]
  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`rounded-full ${dotSize} ${i <= level ? levelColorMap[level] : 'bg-grey-200'}`}
          />
        ))}
      </div>
      <span className={`font-bold ${textSize} ${textColorMap[level]}`}>
        Lv.{level} {info?.label}
      </span>
    </div>
  )
}
