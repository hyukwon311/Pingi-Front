/**
 * @file BaselineTest.tsx - 베이스라인 녹음 페이지
 *
 * 통일 문장 3회 녹음 → uploadBaseline → AI analyze-baseline.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  BASELINE_MIN_SECONDS,
  BASELINE_RECORD_SECONDS,
  BASELINE_SENTENCES,
  PINGI_PROMPT_SENTENCE,
} from '@/constants/sentences'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import VoiceWaveform from '@/components/voice/VoiceWaveform'
import RecStatus from '@/components/voice/RecStatus'
import ProgressBar from '@/components/common/ProgressBar'
import PageTransition from '@/components/layout/PageTransition'
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'
import { useWebSocket } from '@/hooks/useWebSocket'
import { getCurrentMemberId, uploadBaseline } from '@/services/api'

export default function BaselineTest() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([])
  const [phase, setPhase] = useState<'record' | 'uploading' | 'waiting'>('record')
  const [hint, setHint] = useState<string | null>(null)
  const pendingStopRef = useRef(false)
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } =
    useVoiceRecorder()

  useWebSocket({ roomCode: code || '' })

  const isAllDone = currentIndex >= BASELINE_SENTENCES.length
  const canStop = isRecording && recordSeconds >= BASELINE_MIN_SECONDS

  const submitBaseline = useCallback(
    async (blobs: Blob[]) => {
      const memberId = getCurrentMemberId()
      if (!memberId || blobs.length < BASELINE_SENTENCES.length) return

      setPhase('uploading')
      try {
        const sentences = BASELINE_SENTENCES.map(() => PINGI_PROMPT_SENTENCE)
        const result = await uploadBaseline(memberId, blobs, [...sentences])
        if (result.allCompleted) {
          navigate(`/r/${code}/live`)
        } else {
          setPhase('waiting')
        }
      } catch (error) {
        console.error('Failed to upload baseline:', error)
        setHint('업로드에 실패했어요. 다시 시도해 주세요.')
        setPhase('record')
        setCurrentIndex(blobs.length)
        setRecordedBlobs(blobs)
      }
    },
    [code, navigate],
  )

  useEffect(() => {
    if (!audioBlob || !pendingStopRef.current) return
    pendingStopRef.current = false

    setRecordedBlobs((prev) => {
      const nextBlobs = [...prev, audioBlob]
      if (nextBlobs.length < BASELINE_SENTENCES.length) {
        setCurrentIndex(nextBlobs.length)
      } else {
        setCurrentIndex(BASELINE_SENTENCES.length)
        void submitBaseline(nextBlobs)
      }
      return nextBlobs
    })
    resetRecording()
    setRecordSeconds(0)
    setHint(null)
  }, [audioBlob, resetRecording, submitBaseline])

  const handleStopRecording = useCallback(() => {
    if (recordSeconds < BASELINE_MIN_SECONDS) {
      setHint(`조금만 더 읽어주세요 (최소 ${BASELINE_MIN_SECONDS}초)`)
      return
    }
    pendingStopRef.current = true
    stopRecording()
  }, [recordSeconds, stopRecording])

  useEffect(() => {
    if (!isRecording) return

    const timer = setInterval(() => {
      setRecordSeconds((s) => {
        const next = s + 1
        if (next >= BASELINE_RECORD_SECONDS) {
          pendingStopRef.current = true
          stopRecording()
          return BASELINE_RECORD_SECONDS
        }
        return next
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRecording, stopRecording])

  const handleStartRecording = () => {
    setHint(null)
    setRecordSeconds(0)
    startRecording()
  }

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          <h1 className="font-display text-xl text-brown-900">
            🎙️ 베이스라인 녹음
          </h1>
          {phase === 'record' && !isAllDone && (
            <>
              <p className="text-sm text-brown-500 mt-1">
                ({currentIndex + 1} / {BASELINE_SENTENCES.length} 회차 · 같은 문장)
              </p>
              <p className="text-xs text-brown-400 mt-0.5">
                3회 합쳐 약 20초 · 끝까지 읽고 바로 종료해도 돼요
              </p>
            </>
          )}
        </div>

        {phase === 'uploading' ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-5xl mb-4 animate-pulse">🔍</div>
            <p className="font-display text-lg text-brown-900">핑이가 목소리를 저장 중...</p>
          </div>
        ) : phase === 'waiting' || isAllDone ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-5xl mb-4 animate-pulse">⏳</div>
            <p className="font-display text-lg text-brown-900">다른 멤버를 기다리는 중...</p>
            <p className="text-sm text-brown-500 mt-2">
              모두 베이스라인이 끝나면 자동으로 이동해요
            </p>
          </div>
        ) : (
          <>
            <Card className="mt-6 text-center">
              <p className="text-brown-500 text-xs mb-2">
                또박또박 끝까지 읽고, 다 읽으면 종료 (최소 {BASELINE_MIN_SECONDS}초)
              </p>
              <p className="font-display text-lg text-brown-900 leading-relaxed">
                &ldquo;{PINGI_PROMPT_SENTENCE}&rdquo;
              </p>
            </Card>

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {isRecording ? (
                <>
                  <VoiceWaveform active />
                  <RecStatus seconds={recordSeconds} total={BASELINE_RECORD_SECONDS} />
                  <ProgressBar
                    percent={Math.min((recordSeconds / BASELINE_RECORD_SECONDS) * 100, 100)}
                  />
                  {hint && (
                    <p className="text-xs text-amber-700 text-center">{hint}</p>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-brown-400">
                    버튼을 눌러 녹음을 시작하세요
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {phase === 'record' && !isAllDone && (
          <div className="mt-auto pt-6">
            <Button
              variant={isRecording ? 'secondary' : 'primary'}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isRecording && !canStop}
            >
              {isRecording
                ? canStop
                  ? '✓ 다 읽었어요'
                  : `읽는 중… (${BASELINE_MIN_SECONDS}초부터 종료)`
                : '🔴 녹음 시작'}
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
