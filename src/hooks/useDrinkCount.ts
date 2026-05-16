/**
 * @file useDrinkCount.ts - 음주량 카운터 훅
 *
 * 특정 사용자의 마신 잔 수를 조회하고 증가/감소하는 기능을 제공한다.
 * DrinkCounter 컴포넌트와 함께 사용되어 +/- 버튼을 통한 잔 수 변경을 처리한다.
 *
 * @param userId - 음주량을 관리할 사용자 ID
 * @returns { count, increment, decrement } - 현재 잔 수, 증가 함수, 감소 함수
 */
import { useCallback } from 'react'
import { useSession } from './useSession'

export function useDrinkCount(userId: string) {
  const { session, updateDrinkCount } = useSession()
  const participant = session?.participants.find((p) => p.user.id === userId)
  const count = participant?.drinkCount ?? 0

  /** 잔 수 1 증가 */
  const increment = useCallback(() => updateDrinkCount(userId, count + 1), [userId, count, updateDrinkCount])
  /** 잔 수 1 감소 (SessionContext의 리듀서에서 0 미만이 되지 않도록 보장) */
  const decrement = useCallback(() => updateDrinkCount(userId, count - 1), [userId, count, updateDrinkCount])

  return { count, increment, decrement }
}
