/**
 * @file websocket.ts - WebSocket 서비스 (Socket.io 클라이언트)
 *
 * 술자리 진행 중 실시간 이벤트를 수신하기 위한 Socket.io 연결을 관리하는 서비스다.
 * connect() 함수로 서버와 WebSocket 연결을 수립하고,
 * on() 함수로 이벤트 타입별 핸들러를 등록하여 멤버 입장, 핑이타임 발동 등의 이벤트를 처리한다.
 */

import { io, Socket } from 'socket.io-client'

const WS_BASE = import.meta.env.VITE_WS_URL || 'http://localhost:8000'

export type WebSocketEventType =
  | 'member_joined'
  | 'member_updated'
  | 'member_eta_updated'
  | 'member_late'
  | 'room_started'
  | 'baseline_progress'
  | 'all_baseline_complete'
  | 'pingi_time_started'
  | 'recording_progress'
  | 'checkpoint_result'
  | 'result_ack_progress'
  | 'pingi_live_resumed'
  | 'room_ended'
  | 'home_checkin_started'
  | 'home_checkin_result'

export interface WebSocketMessage<T = unknown> {
  type: WebSocketEventType
  payload: T
  timestamp: string
}

type EventHandler<T = unknown> = (payload: T) => void

class PingiWebSocket {
  private socket: Socket | null = null
  private roomCode: string | null = null
  private token: string | null = null
  private handlers: Map<WebSocketEventType, Set<EventHandler>> = new Map()

  /** Socket.io 연결 */
  connect(roomCode: string, token: string): void {
    if (this.socket?.connected) {
      this.disconnect()
    }

    this.roomCode = roomCode
    this.token = token

    this.socket = io(WS_BASE, {
      path: '/v1/ws',
      query: { room: roomCode, token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    this.socket.on('connect', () => {
      console.log('[WS] Connected to Socket.io')
      // 방 채널에 조인
      this.socket?.emit('join_room', roomCode)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[WS] Disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('[WS] Connection error:', error.message)
    })

    // 서버에서 오는 이벤트들 수신
    const eventTypes: WebSocketEventType[] = [
      'member_joined',
      'member_updated',
      'member_eta_updated',
      'member_late',
      'room_started',
      'baseline_progress',
      'all_baseline_complete',
      'pingi_time_started',
      'recording_progress',
      'checkpoint_result',
      'result_ack_progress',
      'pingi_live_resumed',
      'room_ended',
      'home_checkin_started',
      'home_checkin_result',
    ]

    eventTypes.forEach((eventType) => {
      this.socket?.on(eventType, (payload: unknown) => {
        console.log(`[WS] Received ${eventType}:`, payload)
        const handlers = this.handlers.get(eventType)
        if (handlers) {
          handlers.forEach((handler) => handler(payload))
        }
      })
    })
  }

  /** 연결 해제 */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.roomCode = null
    this.token = null
  }

  /** 이벤트 핸들러 등록 */
  on<T = unknown>(type: WebSocketEventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler as EventHandler)

    // 정리 함수 반환
    return () => {
      this.handlers.get(type)?.delete(handler as EventHandler)
    }
  }

  /** 메시지 전송 */
  send(type: string, payload?: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(type, payload)
    }
  }

  /** 연결 상태 확인 */
  isConnected(): boolean {
    return this.socket?.connected ?? false
  }
}

// 싱글톤 인스턴스
export const pingiWS = new PingiWebSocket()
