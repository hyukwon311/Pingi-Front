/**
 * @file VoiceRecording.tsx - 핑이타임 녹음 페이지
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Button from '@/components/common/Button'
import VoiceWaveform from '@/components/voice/VoiceWaveform'
import ProgressBar from '@/components/common/ProgressBar'
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'
import { useWebSocket } from '@/hooks/useWebSocket'
import {
  PINGI_PROMPT_SENTENCE,
  PINGI_TIME_MIN_SECONDS,
  PINGI_TIME_RECORD_SECONDS,
} from '@/constants/sentences'
import { uploadRecording } from '@/services/api'

type Phase = 'idle' | 'recording' | 'uploading' | 'waiting' | 'error'

interface RecordLocationState {
  checkpointId?: string
  sentence?: string
  index?: number
}

export default function VoiceRecording() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as RecordLocationState

  const checkpointId = state.checkpointId
  const sentence = state.sentence ?? PINGI_PROMPT_SENTENCE

  const [phase, setPhase] = useState<Phase>('idle')
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittedCount, setSubmittedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } =
    useVoiceRecorder()

  const pendingUploadRef = useRef(false)

  useWebSocket({
    roomCode: code || '',
    onRecordingProgress: (payload) => {
      if (payload.checkpointId !== checkpointId) return
      setSubmittedCount(payload.submittedCount)
      setTotalCount(payload.totalCount)
    },
  })

  const handleStartRecording = () => {
    if (!checkpointId) {
      setErrorMessage('핑이타임 정보를 찾을 수 없어요. 대시보드에서 다시 시작해 주세요.')
      setPhase('error')
      return
    }
    setErrorMessage(null)
    setRecordSeconds(0)
    resetRecording()
    setPhase('recording')
    startRecording()
  }

  const handleStopRecording = () => {
    if (recordSeconds < PINGI_TIME_MIN_SECONDS) {
      setErrorMessage(
        `조금만 더 읽어주세요. 최소 ${PINGI_TIME_MIN_SECONDS}초 이상이면 분석이 안정적이에요.`,
      )
      setPhase('error')
      stopRecording()
      resetRecording()
      return
    }
    stopRecording()
    pendingUploadRef.current = true
    setPhase('uploading')
  }

  const uploadAudio = useCallback(
    async (blob: Blob) => {
      if (!checkpointId || !code) return

      try {
        await uploadRecording(checkpointId, blob)
        setPhase('waiting')
        setSubmittedCount((c) => Math.max(c, 1))
      } catch (err) {
        console.error('Upload failed:', err)
        setErrorMessage(
          err instanceof Error ? err.message : '분석에 실패했어요. 다시 녹음해 주세요.',
        )
        setPhase('error')
      } finally {
        pendingUploadRef.current = false
        resetRecording()
      }
    },
    [checkpointId, code, resetRecording],
  )

  useEffect(() => {
    if (!pendingUploadRef.current || !audioBlob) return
    uploadAudio(audioBlob)
  }, [audioBlob, uploadAudio])

  useEffect(() => {
    if (!isRecording) return
    const timer = setInterval(() => {
      setRecordSeconds((s) => {
        const next = s + 1
        if (next >= PINGI_TIME_RECORD_SECONDS) {
          stopRecording()
          pendingUploadRef.current = true
          setPhase('uploading')
          return PINGI_TIME_RECORD_SECONDS
        }
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRecording, stopRecording])

  const progressLabel =
    totalCount > 0
      ? `${submittedCount}/${totalCount}명 제출 완료`
      : '다른 멤버의 녹음을 기다리는 중...'

  return (
    <>
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm bg-paper rounded-3xl border-3 border-ink p-6 shadow-lg">
          {phase === 'uploading' ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4 animate-pulse">🔍</div>
              <p className="font-display text-xl text-brown-900">분석 중...</p>
              <p className="text-sm text-brown-500 mt-2">핑이가 듣고 있어요</p>
            </div>
          ) : phase === 'waiting' ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">⏳</div>
              <p className="font-display text-xl text-brown-900">제출 완료!</p>
              <p className="text-sm text-brown-500 mt-2">{progressLabel}</p>
              <p className="text-xs text-brown-400 mt-4">
                모두 끝나면 함께 순위를 볼 수 있어요
              </p>
            </div>
          ) : phase === 'error' ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">😅</p>
              <p className="font-display text-base text-brown-900">{errorMessage}</p>
              <div className="mt-5 flex flex-col gap-2">
                <Button onClick={() => navigate(`/r/${code}/live`)}>대시보드로</Button>
                {checkpointId && (
                  <Button variant="secondary" onClick={() => setPhase('idle')}>
                    다시 시도
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="font-display text-xl text-ink">🎙 지금 따라 읽으세요</h1>
                {state.index != null && (
                  <p className="text-xs text-brown-400 mt-1">핑이타임 #{state.index}</p>
                )}
              </div>
              <p className="text-xs text-brown-500 text-center mb-3">
                베이스라인과 같은 문장을 끝까지 읽어주세요 (권장 {PINGI_TIME_RECORD_SECONDS}초)
              </p>
              <div className="bg-white rounded-2xl p-4 mb-6 shadow-card">
                <p className="font-display text-base text-brown-900 text-center leading-relaxed">
                  &ldquo;{sentence}&rdquo;
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 mb-6">
                <VoiceWaveform active={isRecording} />
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      isRecording ? 'bg-ink animate-pulse' : 'bg-brown-300'
                    }`}
                  />
                  <span className="font-display text-lg text-brown-900">
                    {recordSeconds}초 / {PINGI_TIME_RECORD_SECONDS}초
                  </span>
                </div>
                <div className="w-full">
                  <ProgressBar
                    percent={Math.min((recordSeconds / PINGI_TIME_RECORD_SECONDS) * 100, 100)}
                  />
                </div>
              </div>
              <Button
                variant={isRecording ? 'secondary' : 'primary'}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={!checkpointId}
              >
                {isRecording ? '⏹ 녹음 종료' : '🔴 녹음 시작'}
              </Button>
              {!checkpointId && (
                <p className="text-xs text-brown-400 text-center mt-3">
                  핑이타임이 시작될 때까지 잠시만 기다려 주세요
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
