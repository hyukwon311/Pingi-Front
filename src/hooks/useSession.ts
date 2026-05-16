/**
 * @file useSession.ts - 세션 상태 접근 편의 훅
 *
 * SessionContext의 dispatch를 직접 다루지 않고,
 * 의미 있는 함수(setSession, updateDrinkCount, clearSession)로
 * 세션 상태를 간편하게 조작할 수 있게 해주는 래퍼 훅이다.
 */
import { useCallback } from 'react'
import { useSessionContext } from '@/contexts/SessionContext'
import type { Session } from '@/types/session'

export function useSession() {
  const { state, dispatch } = useSessionContext()

  /** 세션 전체 데이터를 설정 (서버에서 조회 후 호출) */
  const setSession = useCallback(
    (session: Session) => dispatch({ type: 'SET_SESSION', payload: session }),
    [dispatch],
  )

  /** 특정 사용자의 음주량(잔 수)을 변경 */
  const updateDrinkCount = useCallback(
    (userId: string, count: number) =>
      dispatch({ type: 'UPDATE_DRINK_COUNT', payload: { userId, count } }),
    [dispatch],
  )

  /** 세션 상태를 초기화 (세션 퇴장 또는 종료 시 호출) */
  const clearSession = useCallback(() => dispatch({ type: 'CLEAR' }), [dispatch])

  return {
    session: state.session,
    setSession,
    updateDrinkCount,
    clearSession,
  }
}
