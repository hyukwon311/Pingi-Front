/**
 * @file SessionContext.tsx - 현재 세션 상태 관리 Context
 *
 * 진행 중인 술자리 세션의 전역 상태를 useReducer 패턴으로 관리한다.
 * 세션 정보 설정, 참가자 업데이트, 음주량 변경, 초기화 등의 액션을 지원한다.
 *
 * 사용법:
 * - 컴포넌트에서 `useSessionContext()` 훅으로 { state, dispatch }에 접근
 * - 편의상 `useSession()` 훅 (hooks/useSession.ts)을 사용하는 것을 권장
 */
import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react'
import type { Session, Participant } from '@/types/session'

/** 세션 리듀서가 처리하는 액션 타입들 */
type SessionAction =
  | { type: 'SET_SESSION'; payload: Session }               // 세션 전체 데이터 설정
  | { type: 'UPDATE_PARTICIPANT'; payload: Participant }     // 특정 참가자 정보 갱신
  | { type: 'UPDATE_DRINK_COUNT'; payload: { userId: string; count: number } }  // 음주량 변경
  | { type: 'CLEAR' }                                       // 세션 초기화 (퇴장 시)

interface SessionState {
  session: Session | null
}

const initialState: SessionState = { session: null }

/**
 * 세션 상태 리듀서.
 * 불변성을 유지하며 세션 데이터를 업데이트한다.
 */
function reducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_SESSION':
      return { session: action.payload }
    case 'UPDATE_PARTICIPANT':
      if (!state.session) return state
      return {
        session: {
          ...state.session,
          participants: state.session.participants.map((p) =>
            p.user.id === action.payload.user.id ? action.payload : p,
          ),
        },
      }
    case 'UPDATE_DRINK_COUNT':
      if (!state.session) return state
      return {
        session: {
          ...state.session,
          participants: state.session.participants.map((p) =>
            p.user.id === action.payload.userId
              ? { ...p, drinkCount: Math.max(0, action.payload.count) }
              : p,
          ),
        },
      }
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}

const SessionContext = createContext<{ state: SessionState; dispatch: Dispatch<SessionAction> } | null>(null)

/** 세션 상태를 제공하는 Provider 컴포넌트 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  )
}

/**
 * 세션 Context에 접근하는 커스텀 훅.
 * SessionProvider 바깥에서 호출하면 에러를 던진다.
 */
export function useSessionContext() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSessionContext must be used within SessionProvider')
  return ctx
}
