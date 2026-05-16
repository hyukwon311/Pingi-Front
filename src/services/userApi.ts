/**
 * @file userApi.ts - 사용자 관련 API
 *
 * 사용자 등록(닉네임 설정)과 현재 로그인 사용자 정보 조회를 담당한다.
 */
import { api } from './api'
import type { User } from '@/types/user'

export const userApi = {
  /** 닉네임으로 새 사용자 등록 */
  register: (nickname: string) => api.post<User>('/users', { nickname }),
  /** 현재 로그인한 사용자 정보 조회 */
  getMe: () => api.get<User>('/users/me'),
}
