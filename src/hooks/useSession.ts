/**
 * @file useSession.ts - 세션 상태 접근 편의 훅
 *
 * SessionContext의 dispatch를 직접 다루지 않고,
 * 의미 있는 함수(setRoom, updateDrinkCount, clearSession)로
 * 세션 상태를 간편하게 조작할 수 있게 해주는 래퍼 훅이다.
 */
import { useCallback } from 'react'
import { useSessionContext } from '@/contexts/SessionContext'
import type { Room } from '@/services/api'
import type { DrinkType } from '@/types/room'

export function useSession() {
  const { state, dispatch } = useSessionContext()

  const setRoom = useCallback(
    (room: Room) => dispatch({ type: 'SET_ROOM', payload: room }),
    [dispatch],
  )

  const updateDrinkCount = useCallback(
    (memberId: string, drinkType: DrinkType, count: number) =>
      dispatch({ type: 'UPDATE_DRINK_COUNT', payload: { memberId, drinkType, count } }),
    [dispatch],
  )

  const clearSession = useCallback(() => dispatch({ type: 'CLEAR' }), [dispatch])

  return {
    room: state.room,
    isPingiTimeActive: state.isPingiTimeActive,
    pingiTimeResults: state.pingiTimeResults,
    setRoom,
    updateDrinkCount,
    clearSession,
  }
}
