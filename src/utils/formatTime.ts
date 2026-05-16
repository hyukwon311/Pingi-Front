/**
 * @file formatTime.ts - 시간 포맷팅 유틸리티
 *
 * 밀리초(ms) 단위의 시간 값을 사람이 읽기 쉬운 문자열로 변환하는 유틸리티 함수들을 제공한다.
 * formatTimeRemaining()은 남은 시간을 "14:32" 형식으로 표시하고,
 * formatDuration()은 경과 시간을 "1시간 23분" 또는 "45분" 형식으로 표시한다.
 * 세션 대시보드의 카운트다운 타이머, 시상식의 술자리 진행 시간 등에서 사용된다.
 */

/**
 * 남은 시간(밀리초)을 "MM:SS" 카운트다운 형태로 변환한다.
 * @param ms - 남은 시간 (밀리초)
 * @returns "05:30" 형태의 문자열
 */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * 시작 시각과 종료 시각의 차이를 "N시간 M분" 형태로 변환한다.
 * @param startMs - 시작 시각 (밀리초)
 * @param endMs - 종료 시각 (밀리초)
 * @returns "2시간 30분" 또는 "45분" 형태의 문자열
 */
export function formatDuration(startMs: number, endMs: number): string {
  const diff = endMs - startMs
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}시간 ${minutes}분`
  return `${minutes}분`
}
