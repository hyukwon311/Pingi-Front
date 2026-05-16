/**
 * @file user.ts - 사용자 관련 타입 정의
 */

/** 사용자 기본 정보 */
export interface User {
  id: string            // 사용자 고유 ID
  nickname: string      // 닉네임
  avatarUrl?: string    // 프로필 이미지 URL (선택)
}
