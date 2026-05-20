/**
 * @file SessionContext.tsx - 술자리 세션 상태 관리 Context
 *
 * 진행 중인 술자리의 실시간 상태를 전역으로 관리하는 Context다.
 * WebSocket 연결을 통해 서버로부터 다음과 같은 실시간 이벤트를 수신하고 상태를 업데이트한다:
 * - member_joined: 새 멤버 입장 시 멤버 목록 갱신
 * - member_eta_updated: 멤버의 도착 예정 시간 변경
 * - session_started: 술자리 시작 (베이스라인 측정 단계로 이동)
 * - pingi_time_triggered: 핑이타임 발동 알림
 * - pingi_time_result: 핑이타임 결과 수신 및 레벨 업데이트
 * - session_ended: 술자리 종료
 * - home_checkin_updated: 귀가 상태 변경
 * RoomContext와 함께 사용되며, 모든 페이지에서 useSession() 훅으로 세션 상태에 접근할 수 있다.
 */
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
  type Dispatch,
} from 'react'
import type { Room, Member } from '@/services/api'
import type { DrinkType } from '@/types/room'

type SessionAction =
  | { type: 'SET_ROOM'; payload: Room }
  | { type: 'UPDATE_MEMBER'; payload: Member }
  | { type: 'UPDATE_DRINK_COUNT'; payload: { memberId: string; drinkType: DrinkType; count: number } }
  | { type: 'TRIGGER_PINGI_TIME' }
  | { type: 'SET_PINGI_TIME_RESULT'; payload: { results: Member[] } }
  | { type: 'CLEAR' }

interface SessionState {
  room: Room | null
  isPingiTimeActive: boolean
  pingiTimeResults: Member[] | null
}

const initialState: SessionState = {
  room: null,
  isPingiTimeActive: false,
  pingiTimeResults: null,
}

function reducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_ROOM':
      return { ...state, room: action.payload }

    case 'UPDATE_MEMBER':
      if (!state.room) return state
      return {
        ...state,
        room: {
          ...state.room,
          members: state.room.members.map((m) =>
            m.id === action.payload.id ? action.payload : m
          ),
        },
      }

    case 'UPDATE_DRINK_COUNT':
      if (!state.room) return state
      return {
        ...state,
        room: {
          ...state.room,
          members: state.room.members.map((m) =>
            m.id === action.payload.memberId
              ? {
                  ...m,
                  drinks: {
                    ...m.drinks,
                    [action.payload.drinkType]: Math.max(0, action.payload.count),
                  },
                }
              : m
          ),
        },
      }

    case 'TRIGGER_PINGI_TIME':
      return { ...state, isPingiTimeActive: true, pingiTimeResults: null }

    case 'SET_PINGI_TIME_RESULT':
      return { ...state, isPingiTimeActive: false, pingiTimeResults: action.payload.results }

    case 'CLEAR':
      return initialState

    default:
      return state
  }
}

interface SessionContextValue {
  state: SessionState
  dispatch: Dispatch<SessionAction>
  connectWebSocket: (roomCode: string) => void
  disconnectWebSocket: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const connectWebSocket = useCallback((roomCode: string) => {
    // TODO: 실제 WebSocket 연결 구현
    // const ws = new WebSocket(`wss://api.pingi.app/rooms/${roomCode}/ws`)
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data)
    //   switch (data.type) {
    //     case 'member_joined':
    //       dispatch({ type: 'UPDATE_MEMBER', payload: data.member })
    //       break
    //     case 'pingi_time_triggered':
    //       dispatch({ type: 'TRIGGER_PINGI_TIME' })
    //       break
    //     // ... 다른 이벤트 처리
    //   }
    // }
    console.log('WebSocket 연결:', roomCode)
  }, [])

  const disconnectWebSocket = useCallback(() => {
    // TODO: WebSocket 연결 해제
    console.log('WebSocket 연결 해제')
  }, [])

  return (
    <SessionContext.Provider value={{ state, dispatch, connectWebSocket, disconnectWebSocket }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSessionContext() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSessionContext must be used within SessionProvider')
  return ctx
}
