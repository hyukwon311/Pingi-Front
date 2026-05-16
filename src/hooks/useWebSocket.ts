/**
 * @file useWebSocket.ts - WebSocket 연결 및 실시간 이벤트 처리 훅
 */
import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { pingiWS } from '@/services/websocket'
import { getAuthToken } from '@/services/api'

interface UseWebSocketOptions {
  roomCode: string
  onMemberJoined?: (payload: { memberId: string; nickname: string }) => void
  onMemberUpdated?: (payload: { memberId: string; [key: string]: unknown }) => void
  onRoomStarted?: (payload: { status: string; startedAt: string }) => void
  onAllBaselineComplete?: (payload: { startedAt: string }) => void
  onPingiTimeStarted?: (payload: { checkpointId: string; index: number; sentence: string; countdownSeconds: number }) => void
  onCheckpointResult?: (payload: unknown) => void
  onRoomEnded?: (payload: { status: string; reportId: string }) => void
  autoNavigate?: boolean
}

export function useWebSocket({
  roomCode,
  onMemberJoined,
  onMemberUpdated,
  onRoomStarted,
  onAllBaselineComplete,
  onPingiTimeStarted,
  onCheckpointResult,
  onRoomEnded,
  autoNavigate = true,
}: UseWebSocketOptions) {
  const navigate = useNavigate()
  const connectedRef = useRef(false)

  const connect = useCallback(() => {
    const token = getAuthToken()
    if (!token || !roomCode) {
      console.warn('[useWebSocket] No token or roomCode')
      return
    }

    if (connectedRef.current) return
    
    pingiWS.connect(roomCode, token)
    connectedRef.current = true
  }, [roomCode])

  const disconnect = useCallback(() => {
    pingiWS.disconnect()
    connectedRef.current = false
  }, [])

  useEffect(() => {
    if (!roomCode) return

    connect()

    // 이벤트 핸들러 등록
    const cleanups: (() => void)[] = []

    // 멤버 입장
    if (onMemberJoined) {
      cleanups.push(pingiWS.on('member_joined', onMemberJoined))
    }

    // 멤버 정보 업데이트
    if (onMemberUpdated) {
      cleanups.push(pingiWS.on('member_updated', onMemberUpdated))
    }

    // 방 시작 (술자리 시작) → 캐릭터 확인 → 베이스라인 → 핑이 Live
    cleanups.push(pingiWS.on('room_started', (payload: { status: string; startedAt: string }) => {
      console.log('[WS] Room started:', payload)
      onRoomStarted?.(payload)
      if (autoNavigate) {
        // 캐릭터 확인 화면으로 이동 (베이스라인 녹음 전)
        navigate(`/r/${roomCode}/confirm`)
      }
    }))

    // 모든 멤버 베이스라인 완료 → 핑이 Live로 이동
    cleanups.push(pingiWS.on('all_baseline_complete', (payload: { startedAt: string }) => {
      console.log('[WS] All baseline complete:', payload)
      onAllBaselineComplete?.(payload)
      if (autoNavigate) {
        navigate(`/r/${roomCode}/live`)
      }
    }))

    // 핑이타임 시작
    cleanups.push(pingiWS.on('pingi_time_started', (payload: { checkpointId: string; index: number; sentence: string; countdownSeconds: number }) => {
      console.log('[WS] Pingi time started:', payload)
      onPingiTimeStarted?.(payload)
      if (autoNavigate) {
        // 녹음 화면으로 이동하고 checkpoint 정보 전달
        navigate(`/r/${roomCode}/record`, { 
          state: { 
            checkpointId: payload.checkpointId,
            sentence: payload.sentence,
            index: payload.index,
          } 
        })
      }
    }))

    // 체크포인트 결과
    if (onCheckpointResult) {
      cleanups.push(pingiWS.on('checkpoint_result', onCheckpointResult))
    }

    // 방 종료
    cleanups.push(pingiWS.on('room_ended', (payload: { status: string; reportId: string }) => {
      console.log('[WS] Room ended:', payload)
      onRoomEnded?.(payload)
      if (autoNavigate) {
        navigate(`/r/${roomCode}/awards`)
      }
    }))

    return () => {
      cleanups.forEach(cleanup => cleanup())
      disconnect()
    }
  }, [roomCode, connect, disconnect, navigate, autoNavigate, onMemberJoined, onMemberUpdated, onRoomStarted, onAllBaselineComplete, onPingiTimeStarted, onCheckpointResult, onRoomEnded])

  return { connect, disconnect }
}
