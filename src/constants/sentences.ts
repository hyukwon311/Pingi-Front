/**
 * @file sentences.ts - 핑이 통일 발화 문장
 *
 * 베이스라인(동일 문장 3회)과 핑이타임(동일 문장 1회)에 같은 문장을 사용한다.
 * 문장 끝까지 읽으면 되므로, 타이머는 권장·상한만 표시 (최소 길이는 분석 안정용).
 */

/** 앱·핑이타임 공통 읽기 문장 (보통 속도로 약 6~8초) */
export const PINGI_PROMPT_SENTENCE =
  '오늘 술자리 너무 재밌다. 핑이가 내 목소리를 듣고 있으니까 또박또박 읽어 볼게요.'

/** 베이스라인 녹음 횟수 (같은 문장 반복) */
export const BASELINE_RECORD_COUNT = 3

/** 베이스라인: 회차별 동일 문장 (업로드 API 호환) */
export const BASELINE_SENTENCES: readonly string[] = Array.from(
  { length: BASELINE_RECORD_COUNT },
  () => PINGI_PROMPT_SENTENCE,
)

/** 베이스라인 최소(초) — 이보다 짧으면 다음 회차 불가 (너무 짧으면 분석 불안정) */
export const BASELINE_MIN_SECONDS = 5

/** 베이스라인 권장(초) — UI 진행 표시 기준 */
export const BASELINE_RECORD_SECONDS = 8

/** 베이스라인 상한(초) — 이후 자동 종료 */
export const BASELINE_MAX_SECONDS = 12

/** 핑이타임 최소(초) */
export const PINGI_TIME_MIN_SECONDS = 4

/** 핑이타임 권장(초) — UI 표시 */
export const PINGI_TIME_RECORD_SECONDS = 8
