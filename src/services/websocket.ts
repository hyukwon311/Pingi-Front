/**
 * @file websocket.ts - WebSocket 서비스
 *
 * 술자리 진행 중 실시간 이벤트를 수신하기 위한 WebSocket 연결을 관리하는 서비스다.
 * connect() 함수로 서버와 WebSocket 연결을 수립하고,
 * on() 함수로 이벤트 타입별 핸들러를 등록하여 멤버 입장, 핑이타임 발동 등의 이벤트를 처리한다.
 * 연결이 끊어지면 자동으로 재연결을 시도하며, 주기적으로 핑(ping) 메시지를 전송하여 연결 상태를 유지한다.
 * SessionContext에서 이 서비스를 사용하여 실시간 상태 동기화를 구현한다.
 * 환경 변수(VITE_WS_URL)로 WebSocket 엔드포인트를 설정할 수 있다.
 */

const WS_BASE = import.meta.env.VITE_WS_URL || 'wss://api.pingi.app/v1/ws';

export type WebSocketEventType =
  | 'member_joined'
  | 'member_updated'
  | 'member_eta_updated'
  | 'member_late'
  | 'room_started'
  | 'baseline_progress'
  | 'pingi_time_started'
  | 'recording_progress'
  | 'checkpoint_result'
  | 'room_ended'
  | 'home_checkin_started'
  | 'home_checkin_result';

export interface WebSocketMessage<T = unknown> {
  type: WebSocketEventType;
  payload: T;
  timestamp: string;
}

type EventHandler<T = unknown> = (payload: T) => void;

class PingiWebSocket {
  private ws: WebSocket | null = null;
  private roomCode: string | null = null;
  private token: string | null = null;
  private handlers: Map<WebSocketEventType, Set<EventHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private pingInterval: number | null = null;

  /** WebSocket 연결 */
  connect(roomCode: string, token: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.disconnect();
    }

    this.roomCode = roomCode;
    this.token = token;

    const url = `${WS_BASE}?room=${roomCode}&token=${token}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('[WS] Connected');
      this.reconnectAttempts = 0;
      this.startPing();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (e) {
        console.error('[WS] Parse error:', e);
      }
    };

    this.ws.onclose = () => {
      console.log('[WS] Disconnected');
      this.stopPing();
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('[WS] Error:', error);
    };
  }

  /** 연결 해제 */
  disconnect(): void {
    this.stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.roomCode = null;
    this.token = null;
    this.reconnectAttempts = 0;
  }

  /** 이벤트 핸들러 등록 */
  on<T = unknown>(type: WebSocketEventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler as EventHandler);

    // 정리 함수 반환
    return () => {
      this.handlers.get(type)?.delete(handler as EventHandler);
    };
  }

  /** 메시지 전송 */
  send(type: string, payload?: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.handlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message.payload));
    }
  }

  private startPing(): void {
    this.pingInterval = window.setInterval(() => {
      this.send('ping');
    }, 30000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WS] Max reconnect attempts reached');
      return;
    }

    if (!this.roomCode || !this.token) return;

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (this.roomCode && this.token) {
        this.connect(this.roomCode, this.token);
      }
    }, delay);
  }
}

// 싱글톤 인스턴스
export const pingiWS = new PingiWebSocket();
