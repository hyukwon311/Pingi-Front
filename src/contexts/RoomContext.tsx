/**
 * @file RoomContext.tsx - 방 상태 관리 Context
 *
 * 현재 사용자가 참여 중인 방(Room)과 자신의 멤버 정보(CurrentMember)를 전역으로 관리하는 Context다.
 * 로그인 없이 방 코드(roomCode)와 멤버 ID(memberId) 기반으로 동작하며,
 * localStorage를 통해 새로고침 후에도 방 참여 상태가 유지된다.
 * joinRoom, leaveRoom, setCharacter 등의 함수로 방 참여 플로우를 제어하고,
 * 모든 하위 컴포넌트에서 useRoom() 훅으로 방 정보에 접근할 수 있다.
 */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { Room, CurrentMember, CharacterBreed, HungerLevel } from '@/types/room'

const STORAGE_KEY = 'pingi_member'

interface RoomContextState {
  currentMember: CurrentMember | null
  room: Room | null

  // 방 입장/퇴장
  joinRoom: (roomCode: string, nickname: string, isHost?: boolean) => void
  leaveRoom: () => void

  // 멤버 정보 업데이트
  setCharacter: (breed: CharacterBreed) => void
  setMemberId: (memberId: string) => void

  // 방 정보 설정 (API 응답으로 받은 데이터)
  setRoom: (room: Room | null) => void
}

const RoomContext = createContext<RoomContextState | null>(null)

export function RoomProvider({ children }: { children: ReactNode }) {
  const [currentMember, setCurrentMember] = useState<CurrentMember | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  })

  const [room, setRoom] = useState<Room | null>(null)

  const saveToStorage = useCallback((member: CurrentMember | null) => {
    if (member) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(member))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const joinRoom = useCallback(
    (roomCode: string, nickname: string, isHost = false) => {
      const member: CurrentMember = {
        roomCode,
        memberId: '', // API 응답으로 설정됨
        nickname,
        isHost,
      }
      setCurrentMember(member)
      saveToStorage(member)
    },
    [saveToStorage]
  )

  const leaveRoom = useCallback(() => {
    setCurrentMember(null)
    setRoom(null)
    saveToStorage(null)
  }, [saveToStorage])

  const setCharacter = useCallback(
    (breed: CharacterBreed) => {
      if (!currentMember) return
      const updated = { ...currentMember, characterBreed: breed }
      setCurrentMember(updated)
      saveToStorage(updated)
    },
    [currentMember, saveToStorage]
  )

  const setMemberId = useCallback(
    (memberId: string) => {
      if (!currentMember) return
      const updated = { ...currentMember, memberId }
      setCurrentMember(updated)
      saveToStorage(updated)
    },
    [currentMember, saveToStorage]
  )

  return (
    <RoomContext.Provider
      value={{
        currentMember,
        room,
        joinRoom,
        leaveRoom,
        setCharacter,
        setMemberId,
        setRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  const ctx = useContext(RoomContext)
  if (!ctx) throw new Error('useRoom must be used within RoomProvider')
  return ctx
}
