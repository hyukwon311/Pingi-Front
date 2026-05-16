/**
 * @file VoiceRecording.tsx - 핑이타임 녹음 페이지
 *
 * 핑이타임(발음 테스트) 시 현재 발음 상태를 측정하는 녹음 화면이다.
 * 화면 중앙에 빨간 테두리 모달이 표시되고, 그 안에 측정용 잰말 문장이 카드로 나타난다.
 * "녹음 시작" 버튼을 누르면 5초간 녹음이 진행되며,
 * 실시간 파형, 녹음 시간, 프로그레스바가 표시되어 진행 상황을 확인할 수 있다.
 * 녹음 완료 후 음성 데이터를 서버로 전송하여 베이스라인과 비교 분석하고,
 * 결과 화면(SessionResult)으로 이동한다.
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import VoiceWaveform from '@/components/voice/VoiceWaveform'
import ProgressBar from '@/components/common/ProgressBar'
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'
import { BASELINE_SENTENCES } from '@/constants/sentences'

export default function VoiceRecording() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const { isRecording, startRecording, stopRecording, resetRecording } = useVoiceRecorder()

  const sentence = BASELINE_SENTENCES[Math.floor(Math.random() * BASELINE_SENTENCES.length)]

  const handleStartRecording = () => {
    setRecordSeconds(0)
    startRecording()
  }

  const handleStopRecording = () => {
    stopRecording()
    resetRecording()
    setIsComplete(true)
    setTimeout(() => {
      navigate(`/r/${code}/result`)
    }, 1500)
  }

  useEffect(() => {
    if (!isRecording) return

    const timer = setInterval(() => {
      setRecordSeconds((s) => s + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isRecording])

  return (
    <div className="flex-1 flex items-center justify-center px-5 py-10">
      {/* 모달 */}
      <div className="w-full max-w-sm bg-paper rounded-3xl border-3 border-ink p-6 shadow-lg">
        {isComplete ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <p className="font-display text-xl text-brown-900">녹음 완료!</p>
            <p className="text-sm text-brown-500 mt-2">분석 중...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="font-display text-xl text-ink">
                🎙 지금 따라 읽으세요
              </h1>
            </div>

            <div className="bg-white rounded-2xl p-4 mb-6 shadow-card">
              <p className="font-display text-base text-brown-900 text-center leading-relaxed">
                "{sentence}"
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 mb-6">
              <VoiceWaveform active={isRecording} />
              
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-ink animate-pulse' : 'bg-brown-300'}`} />
                <span className="font-display text-lg text-brown-900">
                  {recordSeconds}초 / 5초
                </span>
              </div>

              <div className="w-full">
                <ProgressBar percent={Math.min((recordSeconds / 5) * 100, 100)} />
              </div>
            </div>

            <Button
              variant={isRecording ? 'secondary' : 'primary'}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? '⏹ 녹음 종료' : '🔴 녹음 시작'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
