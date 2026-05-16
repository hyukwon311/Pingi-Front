/**
 * @file useDrinkCount.ts - 음주량 관리 훅
 *
 * 술자리 중 사용자가 마신 술의 종류와 잔 수를 관리하는 커스텀 훅이다.
 * 5가지 술 종류(소주, 맥주, 소맥, 와인, 양주)별로 잔 수를 추적하고,
 * 각 술의 소주 환산 계수를 적용하여 총 소주 환산 잔 수를 자동으로 계산한다.
 * addDrink, resetDrinks 함수로 음주량을 기록 및 초기화할 수 있으며,
 * SessionDashboard 페이지에서 "내 잔수" 기능 구현에 사용된다.
 */
import { useState, useCallback, useMemo } from 'react'
import type { DrinkType } from '@/types/room'
import { sojuMultiplier } from '@/components/common/DrinkChip'

const DRINK_TYPES: DrinkType[] = ['soju', 'beer', 'somaek', 'wine', 'liquor']

const initialCounts: Record<DrinkType, number> = {
  soju: 0,
  beer: 0,
  somaek: 0,
  wine: 0,
  liquor: 0,
}

export function useDrinkCount(initial?: Partial<Record<DrinkType, number>>) {
  const [counts, setCounts] = useState<Record<DrinkType, number>>({
    ...initialCounts,
    ...initial,
  })

  const increment = useCallback((type: DrinkType) => {
    setCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))
  }, [])

  const decrement = useCallback((type: DrinkType) => {
    setCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
    }))
  }, [])

  const setCount = useCallback((type: DrinkType, count: number) => {
    setCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, count),
    }))
  }, [])

  const reset = useCallback(() => {
    setCounts(initialCounts)
  }, [])

  const totalSoju = useMemo(() => {
    return DRINK_TYPES.reduce(
      (sum, type) => sum + counts[type] * sojuMultiplier[type],
      0
    )
  }, [counts])

  const totalDrinks = useMemo(() => {
    return DRINK_TYPES.reduce((sum, type) => sum + counts[type], 0)
  }, [counts])

  return {
    counts,
    increment,
    decrement,
    setCount,
    reset,
    totalSoju,
    totalDrinks,
    DRINK_TYPES,
  }
}
