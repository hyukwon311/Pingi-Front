/**
 * @file voice.ts - 음성 녹음 및 발음 분석 관련 타입 정의
 *
 * 음성 녹음 데이터와 발음 분석 결과를 나타내는 타입들을 정의한다.
 * VoiceRecording은 녹음된 오디오 blob과 메타데이터를 포함하며,
 * PronunciationResult는 서버에서 분석한 발음 정확도, 변화율, 신뢰도 등을 담고 있다.
 * 베이스라인 측정과 핑이타임 발음 테스트에서 사용된다.
 */

/** 음성 녹음 데이터 */
export interface VoiceRecording {
  id: string            // 녹음 고유 ID
  userId: string        // 녹음한 사용자 ID
  sessionId: string     // 소속 세션 ID
  sentence: string      // 읽은 문장 텍스트
  audioUrl?: string     // 녹음 파일 URL
  timestamp: number     // 녹음 시각 (Unix timestamp)
  isBaseline: boolean   // true이면 기준(술 마시기 전) 녹음, false이면 테스트 녹음
}

/** 발음 분석 결과 */
export interface PronunciationResult {
  userId: string        // 사용자 ID
  changeRate: number    // 발음 변화율 (0~1, 높을수록 많이 변함)
  level: number         // 산출된 취도 레벨 (1~5)
  recordedAt: number    // 분석 시각
}
