/**
 * @file BaselineTest.tsx - 베이스라인 녹음 페이지
 *
 * 술자리 시작 전, 사용자의 정상 발음 상태를 측정하는 화면이다.
 * 3개의 잰말(난이도 높은 문장)을 하나씩 녹음하며, 각 문장마다 5초간 녹음한다.
 * "녹음 시작" / "녹음 종료" 버튼으로 수동 제어하며,
 * 녹음 중에는 실시간 파형(VoiceWaveform)과 진행 상황(ProgressBar)이 표시된다.
 * 3회차 모두 완료하면 베이스라인 데이터를 서버에 저장하고,
 * 술자리 메인 화면(SessionDashboard)으로 이동한다.
 */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BASELINE_SENTENCES } from '@/constants/sentences'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import VoiceWaveform from '@/components/voice/VoiceWaveform'
import RecStatus from '@/components/voice/RecStatus'
import ProgressBar from '@/components/common/ProgressBar'
import PageTransition from '@/components/layout/PageTransition'
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'

const RECORD_DURATION = 5

export default function BaselineTest() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const { isRecording, startRecording, stopRecording, resetRecording } = useVoiceRecorder()

  const isAllDone = currentIndex >= BASELINE_SENTENCES.length

  const handleComplete = useCallback(() => {
    stopRecording()
    resetRecording()
    setRecordSeconds(0)

    if (currentIndex < BASELINE_SENTENCES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(BASELINE_SENTENCES.length)
    }
  }, [currentIndex, stopRecording, resetRecording])

  useEffect(() => {
    if (!isRecording) return

    const timer = setInterval(() => {
      setRecordSeconds((s) => {
        if (s >= RECORD_DURATION - 1) {
          handleComplete()
          return 0
        }
        return s + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRecording, handleComplete])

  const handleStartRecording = () => {
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
          {!isAllDone && (
            <p className="text-sm text-brown-500 mt-1">
              ({currentIndex + 1} / {BASELINE_SENTENCES.length} 회차)
            </p>
          )}
        </div>

        {isAllDone ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="font-display text-lg text-brown-900">
              베이스라인 저장 완료!
            </p>
            <p className="text-sm text-brown-500 mt-2">
              술자리 시작합니다 🍺
            </p>
          </div>
        ) : (
          <>
            <Card className="mt-6 text-center">
              <p className="text-brown-500 text-xs mb-2">
                위 문장을 자연스럽게 읽어주세요
              </p>
              <p className="font-display text-lg text-brown-900 leading-relaxed">
                "{BASELINE_SENTENCES[currentIndex]}"
              </p>
            </Card>

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {isRecording ? (
                <>
                  <VoiceWaveform active />
                  <RecStatus seconds={recordSeconds + 1} total={RECORD_DURATION} />
                  <ProgressBar percent={((recordSeconds + 1) / RECORD_DURATION) * 100} />
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

        <div className="mt-auto pt-6">
          {isAllDone ? (
            <Button onClick={() => navigate(`/r/${code}/live`)}>
              술자리 시작! 🍺
            </Button>
          ) : (
            <Button
              variant={isRecording ? 'secondary' : 'primary'}
              onClick={isRecording ? handleComplete : handleStartRecording}
            >
              {isRecording ? '⏹ 녹음 중지' : '🔴 녹음 시작'}
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
