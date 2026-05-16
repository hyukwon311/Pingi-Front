/**
 * @file levels.ts - 취도 레벨 상수 정의
 *
 * 1~5단계 취도 레벨의 라벨, 색상, 설명을 정의하고,
 * 발음 테스트 주기(기본 30분)를 상수로 관리한다.
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

/** 발음 테스트 반복 주기 (30분, 밀리초 단위) */
export const TEST_INTERVAL_MS = 30 * 60 * 1000
