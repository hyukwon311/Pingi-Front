/**
 * @file DrinkChip.tsx - 술 종류 선택 칩
 *
 * 소주, 맥주, 소맥, 와인, 양주 선택 버튼.
 * 소주잔 환산 계수도 함께 export.
 */
import type { DrinkType } from '@/types/room'

const drinkLabels: Record<DrinkType, string> = {
  soju: '🍶 소주',
  beer: '🍺 맥주',
  somaek: '🍻 소맥',
  wine: '🍷 와인',
  liquor: '🥃 양주',
}

export const sojuMultiplier: Record<DrinkType, number> = {
  soju: 1.0,
  beer: 0.5,
  somaek: 0.8,
  wine: 1.2,
  liquor: 2.0,
}

interface DrinkChipProps {
  type: DrinkType
  active?: boolean
  onClick?: () => void
}

export default function DrinkChip({ type, active = false, onClick }: DrinkChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded-full text-xs border-[1.5px] transition-colors ${
        active
          ? 'border-highlight bg-highlight font-bold'
          : 'border-brown-300 bg-white'
      }`}
    >
      {drinkLabels[type]}
    </button>
  )
}

export { drinkLabels }
