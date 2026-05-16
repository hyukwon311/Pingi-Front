/**
 * @file LevelBadge.tsx - 취도 레벨 배지
 *
 * 캐릭터 우하단에 붙는 원형 레벨 배지.
 * 레벨별로 다른 색상 표시.
 */

const levelColors: Record<number, string> = {
  0: 'bg-lv-0',
  1: 'bg-lv-1',
  2: 'bg-lv-2 text-brown-900',
  3: 'bg-lv-3',
  4: 'bg-lv-4',
  5: 'bg-lv-5',
}

const levelLabels: Record<number, string> = {
  0: '멀쩡',
  1: '달아오름',
  2: '기분좋음',
  3: '꽤취함',
  4: '많이취함',
  5: '꽐라',
}

interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md'
}

export default function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const sizeClass = size === 'sm' ? 'w-4 h-4 text-[8px]' : 'w-5 h-5 text-[9px]'
  const colorClass = levelColors[level] ?? levelColors[0]

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-extrabold text-white border-2 border-paper ${colorClass}`}
      title={levelLabels[level]}
    >
      {level}
    </div>
  )
}

export { levelLabels }
