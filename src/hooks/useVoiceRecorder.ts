/**
 * @file useVoiceRecorder.ts - 음성 녹음 훅
 *
 * 브라우저의 MediaRecorder API를 사용하여 마이크 녹음을 제어한다.
 * 녹음 시작/정지/리셋 기능을 제공하며, 녹음된 오디오를 Blob으로 반환한다.
 * BaselineTest, VoiceRecording 페이지에서 사용된다.
 *
 * @returns { isRecording, audioBlob, startRecording, stopRecording, resetRecording }
 */
import { useState, useRef, useCallback } from 'react'

interface UseVoiceRecorderReturn {
  isRecording: boolean                  // 현재 녹음 중 여부
  audioBlob: Blob | null                // 녹음 완료된 오디오 Blob
  startRecording: () => Promise<void>   // 녹음 시작 (마이크 권한 요청)
  stopRecording: () => void             // 녹음 정지
  resetRecording: () => void            // 녹음 데이터 초기화
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  /** 마이크 접근 권한을 요청하고 녹음을 시작한다 */
  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    mediaRecorderRef.current = mediaRecorder
    chunksRef.current = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      setAudioBlob(blob)
      stream.getTracks().forEach((t) => t.stop())
    }

    mediaRecorder.start()
    setIsRecording(true)
  }, [])

  /** 녹음을 정지하고 오디오 Blob을 생성한다 */
  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }, [])

  /** 녹음 데이터를 초기화하여 재녹음을 준비한다 */
  const resetRecording = useCallback(() => {
    setAudioBlob(null)
    chunksRef.current = []
  }, [])

  return { isRecording, audioBlob, startRecording, stopRecording, resetRecording }
}
