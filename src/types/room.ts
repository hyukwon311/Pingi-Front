/**
 * @file room.ts - 방 및 멤버 관련 타입 정의
 *
 * 핑이 앱의 핵심 데이터 구조인 방(Room)과 멤버(Member) 타입을 정의한다.
 * 로그인 없이 방 코드(roomCode) 기반으로 동작하며,
 * 각 방에는 여러 멤버가 참여하고 각자의 캐릭터, 레벨, 음주량, 귀가 상태 등을 관리한다.
 * CharacterBreed, HungerLevel, DrinkType, EtaStatus, HomeStatus 등
 * 앱 전반에서 사용되는 공통 타입들도 함께 export한다.
 */

/** 캐릭터 종류 (6견종) */
export type CharacterBreed =
  | 'retriever'   // 덕배
  | 'pomeranian'  // 뽀삐
  | 'shiba'       // 콩이
  | 'dachshund'   // 곰자
  | 'poodle'      // 눈송이
  | 'bulldog'     // 멍구

/** 공복도 */
export type HungerLevel = 'full' | 'little' | 'hungry' | 'starving'

/** 술 종류 */
export type DrinkType = 'soju' | 'beer' | 'somaek' | 'wine' | 'liquor'

/** ETA 상태 */
export type EtaStatus = 'ontime' | '5min' | '10min' | 'late' | 'arrived'

/** 귀가 상태 */
export type HomeStatus = 'pending' | 'moving' | 'home'

/** 방 멤버 정보 */
export interface Member {
  memberId: string               // 멤버 고유 ID
  nickname: string               // 닉네임
  characterBreed?: CharacterBreed // 선택한 캐릭터
  isHost: boolean                // 방장 여부
  level: number                  // 현재 취도 레벨 (0~5)
  drinkCounts: Record<DrinkType, number> // 술 종류별 잔 수
  etaTime?: string               // 도착 예정 시간 (HH:mm)
  etaStatus: EtaStatus           // ETA 상태
  hungerLevel?: HungerLevel      // 공복도
  homeStatus: HomeStatus         // 귀가 상태
  homeArrivedAt?: string         // 귀가 완료 시각
  levelHistory: { timestamp: number; level: number }[] // 레벨 변화 이력
}

/** 방 상태 */
export type RoomStatus =
  | 'waiting'   // 대기 중 (멤버 모집)
  | 'baseline'  // 베이스라인 녹음 중
  | 'active'    // 술자리 진행 중
  | 'awards'    // 시상식
  | 'home'      // 귀가 체크인
  | 'done'      // 종료

/** 방 정보 */
export interface Room {
  code: string                   // 방 코드 (6자리)
  place: string                  // 장소
  scheduledAt: string            // 약속 시간 (ISO string)
  hostNickname: string           // 방장 닉네임
  status: RoomStatus             // 방 상태
  members: Member[]              // 참여 멤버 목록
  pingiTimeCount: number         // 핑이타임 횟수
  createdAt: string              // 생성 시각
  startedAt?: string             // 술자리 시작 시각
  endedAt?: string               // 술자리 종료 시각
}

/** 현재 사용자(내) 정보 - localStorage에 저장 */
export interface CurrentMember {
  roomCode: string
  memberId: string
  nickname: string
  characterBreed?: CharacterBreed
  isHost: boolean
}
