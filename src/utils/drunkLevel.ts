/**
 * @file drunkLevel.ts - 취도 레벨 판정 유틸리티
 *
 * 발음 분석 결과에서 얻은 변화율(changeRate)을 기반으로 사용자의 취도 레벨(LV0~5)을 계산하는 유틸리티 함수들을 제공한다.
 * getDrunkLevel() 함수는 변화율 수치를 입력받아 해당하는 레벨을 반환하며,
 * getDrunkLevelColor() 함수는 레벨에 맞는 색상 코드를 반환하여 UI에서 레벨을 시각적으로 표현할 수 있게 한다.
 * 이 함수들은 핑이타임 결과 화면, 세션 대시보드 등에서 멤버의 현재 취도 상태를 표시하는데 사용된다.
 */
import { DRUNK_LEVELS } from '@/constants/levels'

/**
 * 발음 변화율에 따라 취도 레벨 객체를 반환한다.
 * @param changeRate - 발음 변화율 (0~1 사이 값)
 * @returns 해당하는 DrunkLevel 객체
 *
 * 변화율 기준:
 * - 0.10 미만 → Lv.1 (멀쩡)
 * - 0.25 미만 → Lv.2 (살짝)
 * - 0.45 미만 → Lv.3 (적당히)
 * - 0.65 미만 → Lv.4 (많이)
 * - 0.65 이상 → Lv.5 (만취)
 */
export function getLevel(changeRate: number) {
  if (changeRate < 0.1) return DRUNK_LEVELS[0]
  if (changeRate < 0.25) return DRUNK_LEVELS[1]
  if (changeRate < 0.45) return DRUNK_LEVELS[2]
  if (changeRate < 0.65) return DRUNK_LEVELS[3]
  return DRUNK_LEVELS[4]
}

/**
 * 취도 레벨 번호에 해당하는 Tailwind CSS 색상 클래스를 반환한다.
 * @param level - 취도 레벨 (1~5)
 * @returns 색상 클래스명 (예: 'drunk-1', 'drunk-2', ...)
 */
export function getLevelColor(level: number): string {
  return DRUNK_LEVELS[Math.min(level, 5) - 1]?.color ?? 'drunk-1'
}
