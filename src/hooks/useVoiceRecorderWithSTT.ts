/**
 * @file useVoiceRecorderWithSTT.ts - 음성 녹음 + 실시간 STT 훅
 *
 * 브라우저 MediaRecorder + Web Speech API(크롬 등).
 * Safari는 Web Speech 미지원일 수 있음 — 그 경우에도 녹음 blob은 전송 가능.
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

// Web Speech API 타입 선언
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface UseVoiceRecorderWithSTTReturn {
  isRecording: boolean
  audioBlob: Blob | null
  transcript: string
  interimTranscript: string
  isSTTSupported: boolean
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob | null>
  resetRecording: () => void
  /** 녹음 종료 직후, 아직 finalize 안 된 interim까지 합친 텍스트 */
  getTranscriptSnapshot: () => string
}

export function useVoiceRecorderWithSTT(): UseVoiceRecorderWithSTTReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const isRecordingRef = useRef(false)
  const finalsRef = useRef('')
  const interimRef = useRef('')

  const isSTTSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const getTranscriptSnapshot = useCallback(() => {
    return (finalsRef.current + interimRef.current).trim()
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

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
      }

      if (isSTTSupported) {
        const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognitionCtor()
        recognitionRef.current = recognition

        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'ko-KR'

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalChunk = ''
          let interim = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result && result[0]) {
              if (result.isFinal) {
                finalChunk += result[0].transcript
              } else {
                interim += result[0].transcript
              }
            }
          }

          if (finalChunk) {
            finalsRef.current += finalChunk
            setTranscript(finalsRef.current)
          }
          interimRef.current = interim
          setInterimTranscript(interim)
        }

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event)
        }

        recognition.onend = () => {
          if (isRecordingRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start()
            } catch {
              /* already running */
            }
          }
        }

        recognition.start()
      }

      finalsRef.current = ''
      interimRef.current = ''
      setTranscript('')
      setInterimTranscript('')
      mediaRecorder.start()
      isRecordingRef.current = true
      setIsRecording(true)
    } catch (error) {
      console.error('마이크 접근 실패:', error)
      alert('마이크 권한을 허용해주세요.')
    }
  }, [isSTTSupported])

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      finalsRef.current += interimRef.current
      interimRef.current = ''
      setTranscript(finalsRef.current)
      setInterimTranscript('')

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {
          /* */
        }
        recognitionRef.current = null
      }

      const rec = mediaRecorderRef.current
      if (rec && rec.state !== 'inactive') {
        rec.onstop = () => {
          const mime = rec.mimeType || 'audio/webm'
          const blob = new Blob(chunksRef.current, { type: mime })
          setAudioBlob(blob)
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop())
          }
          isRecordingRef.current = false
          setIsRecording(false)
          resolve(blob)
        }
        rec.stop()
      } else {
        isRecordingRef.current = false
        setIsRecording(false)
        resolve(null)
      }
    })
  }, [])

  const resetRecording = useCallback(() => {
    setAudioBlob(null)
    setTranscript('')
    setInterimTranscript('')
    finalsRef.current = ''
    interimRef.current = ''
    chunksRef.current = []
  }, [])

  return {
    isRecording,
    audioBlob,
    transcript,
    interimTranscript,
    isSTTSupported,
    startRecording,
    stopRecording,
    resetRecording,
    getTranscriptSnapshot,
  }
}
