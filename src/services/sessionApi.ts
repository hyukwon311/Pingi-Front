/**
 * @file sessionApi.ts - 세션(술자리) 관련 API
 *
 * 세션 생성, 조회, 참가, 시작, 종료 및 음주량 업데이트 등
 * 세션 라이프사이클 전반의 API 호출을 담당한다.
 */
import { api } from './api'
import type { Session } from '@/types/session'

export const sessionApi = {
  /** 새 세션 생성 */
  create: (name: string) => api.post<Session>('/sessions', { name }),
  /** 세션 ID로 세션 정보 조회 */
  get: (id: string) => api.get<Session>(`/sessions/${id}`),
  /** 초대 코드로 세션에 참가 */
  join: (inviteCode: string) => api.post<Session>('/sessions/join', { inviteCode }),
  /** 세션 시작 (방장만 가능) */
  start: (id: string) => api.post<void>(`/sessions/${id}/start`),
  /** 세션 종료 */
  finish: (id: string) => api.post<void>(`/sessions/${id}/finish`),
  /** 참가자의 음주량(잔 수) 업데이트 */
  updateDrinkCount: (sessionId: string, userId: string, count: number) =>
    api.put<void>(`/sessions/${sessionId}/participants/${userId}/drinks`, { count }),
}
