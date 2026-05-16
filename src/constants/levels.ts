/**
 * @file levels.ts - 취도 레벨 상수 정의
 *
 * 핑이 앱에서 사용하는 취도 레벨(LV0~5)의 라벨, 이름, 설명, 색상을 정의한다.
 * LV0(멀쩡)부터 LV5(만취)까지 6단계로 구분되며,
 * 각 레벨마다 고유한 색상 코드와 사용자 친화적인 설명이 매핑되어 있다.
 * 또한 핑이타임(발음 테스트) 측정 주기를 상수(TEST_INTERVAL_MS)로 관리하며,
 * 현재는 15분(900,000ms)으로 설정되어 있다.
 */

/** 취도 레벨 하나의 구조 */
export interface DrunkLevel {
  level: number       // 레벨 번호 (1~5)
  label: string       // 표시 라벨 (멀쩡, 살짝, ...)
  color: string       // Tailwind CSS 색상 클래스명
  description: string // 발음 변화 설명
}

/** 취도 1~5단계 정의 배열 */
export const DRUNK_LEVELS: DrunkLevel[] = [
  { level: 1, label: '멀쩡', color: 'drunk-1', description: '변화 없음' },
  { level: 2, label: '살짝', color: 'drunk-2', description: '약간 변화' },
  { level: 3, label: '적당히', color: 'drunk-3', description: '중간 변화' },
  { level: 4, label: '많이', color: 'drunk-4', description: '큰 변화' },
  { level: 5, label: '만취', color: 'drunk-5', description: '매우 큰 변화' },
]

/** 발음 테스트 반복 주기 (15분, 밀리초 단위) */
export const TEST_INTERVAL_MS = 15 * 60 * 1000
