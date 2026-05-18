/**
 * @file voiceApi.ts - 음성 녹음 및 발음 분석 API
 *
 * 음성 파일(Blob)을 서버에 업로드하고 발음 분석 결과를 조회한다.
 * 오디오 파일은 FormData로 전송하므로 공통 api 래퍼 대신 직접 fetch를 사용한다.
 */
import { api } from './api'
import type { PronunciationResult } from '@/types/voice'

export const voiceApi = {
  /**
   * 기준(술 마시기 전) 발음 녹음을 서버에 제출한다.
   * 서버는 이 기준 녹음과 이후 테스트 녹음을 비교하여 취도를 산출한다.
   */
  submitBaseline: (sessionId: string, audioBlob: Blob) => {
    const form = new FormData()
    form.append('audio', audioBlob, 'baseline.webm')
    return fetch(
      `${import.meta.env.VITE_API_URL ?? '/v1'}/sessions/${sessionId}/baseline`,
      { method: 'POST', body: form },
    )
  },
  /**
   * 술자리 도중 발음 테스트 녹음을 서버에 제출한다.
   * 30분 간격으로 반복되며, 기준 발음과 비교하여 취도 변화를 측정한다.
   */
  submitTest: (sessionId: string, audioBlob: Blob) => {
    const form = new FormData()
    form.append('audio', audioBlob, 'test.webm')
    return fetch(
      `${import.meta.env.VITE_API_URL ?? '/v1'}/sessions/${sessionId}/test`,
      { method: 'POST', body: form },
    )
  },
  /** 세션의 모든 참가자 발음 분석 결과를 조회한다 */
  getResults: (sessionId: string) =>
    api.get<PronunciationResult[]>(`/sessions/${sessionId}/results`),
}
