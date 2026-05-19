/**
 * @file useWebSocket.ts - WebSocket 연결 및 실시간 이벤트 처리 훅
 *
 * 콜백이 바뀌어도 소켓 연결을 유지하기 위해 ref로 최신 콜백을 추적한다.
 * 소켓 연결/해제는 roomCode가 바뀔 때만 수행한다.
 */
import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { pingiWS } from '@/services/websocket'
import { getAuthToken } from '@/services/api'
import type { CheckpointResult } from '@/services/api'

interface UseWebSocketOptions {
  roomCode: string
  onMemberJoined?: (payload: { memberId: string; nickname: string }) => void
  onMemberUpdated?: (payload: { memberId: string; [key: string]: unknown }) => void
  onRoomStarted?: (payload: { status: string; startedAt: string }) => void
  onAllBaselineComplete?: (payload: { startedAt: string }) => void
  onPingiTimeStarted?: (payload: { checkpointId: string; index: number; sentence: string; countdownSeconds: number }) => void
  onRecordingProgress?: (payload: { checkpointId: string; submittedCount: number; totalCount: number }) => void
  onCheckpointResult?: (payload: CheckpointResult) => void
  onResultAckProgress?: (payload: { checkpointId: string; ackedCount: number; totalCount: number }) => void
  onPingiLiveResumed?: (payload: { checkpointId: string; nextPingiEndsAt: string }) => void
  onRoomEnded?: (payload: { status: string; reportId: string }) => void
  autoNavigate?: boolean
}

export function useWebSocket(opts: UseWebSocketOptions) {
  const {
    roomCode,
    autoNavigate = true,
  } = opts

  const navigate = useNavigate()
  const connectedRef = useRef(false)

  const optsRef = useRef(opts)
  optsRef.current = opts

  const navigateRef = useRef(navigate)
  navigateRef.current = navigate

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

    const cleanups: (() => void)[] = []

    cleanups.push(pingiWS.on('member_joined', (payload: { memberId: string; nickname: string }) => {
      optsRef.current.onMemberJoined?.(payload)
    }))

    cleanups.push(pingiWS.on('member_updated', (payload: { memberId: string; [key: string]: unknown }) => {
      optsRef.current.onMemberUpdated?.(payload)
    }))

    cleanups.push(pingiWS.on('room_started', (payload: { status: string; startedAt: string }) => {
      console.log('[WS] Room started:', payload)
      optsRef.current.onRoomStarted?.(payload)
      if (optsRef.current.autoNavigate !== false) {
        navigateRef.current(`/r/${roomCode}/confirm`)
      }
    }))

    cleanups.push(pingiWS.on('all_baseline_complete', (payload: { startedAt: string }) => {
      console.log('[WS] All baseline complete:', payload)
      optsRef.current.onAllBaselineComplete?.(payload)
      if (optsRef.current.autoNavigate !== false) {
        navigateRef.current(`/r/${roomCode}/live`)
      }
    }))

    cleanups.push(pingiWS.on('pingi_time_started', (payload: { checkpointId: string; index: number; sentence: string; countdownSeconds: number }) => {
      console.log('[WS] Pingi time started:', payload)
      optsRef.current.onPingiTimeStarted?.(payload)
      if (optsRef.current.autoNavigate !== false) {
        navigateRef.current(`/r/${roomCode}/record`, {
          state: {
            checkpointId: payload.checkpointId,
            sentence: payload.sentence,
            index: payload.index,
          },
        })
      }
    }))

    cleanups.push(pingiWS.on('recording_progress', (payload: { checkpointId: string; submittedCount: number; totalCount: number }) => {
      optsRef.current.onRecordingProgress?.(payload)
    }))

    cleanups.push(pingiWS.on('checkpoint_result', (payload: CheckpointResult) => {
      console.log('[WS] Checkpoint result:', payload)
      optsRef.current.onCheckpointResult?.(payload)
      if (optsRef.current.autoNavigate !== false) {
        navigateRef.current(`/r/${roomCode}/result`, {
          state: { checkpointResult: payload },
        })
      }
    }))

    cleanups.push(pingiWS.on('result_ack_progress', (payload: { checkpointId: string; ackedCount: number; totalCount: number }) => {
      optsRef.current.onResultAckProgress?.(payload)
    }))

    cleanups.push(pingiWS.on('pingi_live_resumed', (payload: { checkpointId: string; nextPingiEndsAt: string }) => {
      console.log('[WS] Pingi live resumed:', payload)
      sessionStorage.setItem(`pingi_next_ends_${roomCode}`, payload.nextPingiEndsAt)
      optsRef.current.onPingiLiveResumed?.(payload)
      if (optsRef.current.autoNavigate !== false) {
        navigateRef.current(`/r/${roomCode}/live`)
      }
    }))

    cleanups.push(pingiWS.on('room_ended', (payload: { status: string; reportId: string }) => {
      console.log('[WS] Room ended:', payload)
      optsRef.current.onRoomEnded?.(payload)
      if (optsRef.current.autoNavigate !== false) {
        navigateRef.current(`/r/${roomCode}/awards`)
      }
    }))

    return () => {
      cleanups.forEach((cleanup) => cleanup())
      disconnect()
    }
  }, [roomCode, connect, disconnect])

  return { connect, disconnect }
}
