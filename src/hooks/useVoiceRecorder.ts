/**
 * @file useVoiceRecorder.ts - 음성 녹음 훅
 *
 * 브라우저의 MediaRecorder API를 사용하여 마이크로 음성을 녹음하는 커스텀 훅이다.
 * startRecording()으로 녹음을 시작하고, stopRecording()으로 종료하며,
 * 녹음된 오디오는 Blob 형태로 audioBlob 상태에 저장된다.
 * 마이크 권한이 거부되면 사용자에게 알림을 표시하며,
 * BaselineTest(베이스라인 측정)와 VoiceRecording(핑이타임) 페이지에서 발음 녹음에 사용된다.
 * resetRecording()으로 녹음 데이터를 초기화할 수 있다.
 *
 * @returns { isRecording, audioBlob, startRecording, stopRecording, resetRecording }
 */
import { useState, useRef, useCallback } from 'react'

function pickMediaRecorder(stream: MediaStream): MediaRecorder {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ]
  for (const t of types) {
    try {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) {
        return new MediaRecorder(stream, { mimeType: t })
      }
    } catch {
      /* try next */
    }
  }
  return new MediaRecorder(stream)
}

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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = pickMediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = () => {
        const mime = mediaRecorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mime })
        setAudioBlob(blob)
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('마이크 접근 실패:', error)
      alert('마이크 권한을 허용해주세요. 브라우저 설정에서 마이크 접근을 확인하세요.')
    }
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
