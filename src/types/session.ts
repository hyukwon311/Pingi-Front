/**
 * @file session.ts - 술자리 세션 관련 타입 정의
 *
 * 술자리(세션)의 참가자 정보와 세션 자체의 상태를 정의한다.
 */
import type { User } from './user'

/** 세션 참가자 정보 */
export interface Participant {
  user: User                    // 사용자 기본 정보
  drunkLevel: number            // 현재 취도 레벨 (1~5)
  drinkCount: number            // 마신 잔 수
  isReady: boolean              // 대기실에서 준비 완료 여부
  levelHistory: { timestamp: number; level: number }[]  // 시간별 취도 변화 이력
}

/** 술자리 세션 정보 */
export interface Session {
  id: string                    // 세션 고유 ID
  name: string                  // 세션 이름 (예: "금요 회식")
  hostId: string                // 방장의 사용자 ID
  inviteCode: string            // 6자리 초대 코드
  status: 'waiting' | 'baseline' | 'active' | 'finished'  // 세션 상태: 대기 → 기준측정 → 진행중 → 종료
  participants: Participant[]   // 참가자 목록
  createdAt: number             // 세션 생성 시각 (Unix timestamp)
  startedAt?: number            // 세션 시작 시각
  finishedAt?: number           // 세션 종료 시각
}
