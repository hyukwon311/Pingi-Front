/**
 * @file BaselineTest.tsx - 기준 발음 측정 페이지
 *
 * 술 마시기 전의 기준 발음을 측정하는 화면.
 * 사용자는 3개의 잰말 문장을 순서대로 녹음하며,
 * 모든 문장 녹음이 완료되면 서버에 전송 후 대기실로 복귀한다.
 * 대기실에서 해당 참가자는 자동으로 "준비 완료" 상태가 된다.
 *
 * 플로우: 문장 표시 → 녹음 버튼 클릭 → 녹음 → 정지 → 다음 문장 → ... → 서버 전송 → 대기실 복귀
 */
import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSession } from '@/hooks/useSession'
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'
import { voiceApi } from '@/services/voiceApi'
import { BASELINE_SENTENCES } from '@/constants/sentences'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import SentenceDisplay from '@/components/voice/SentenceDisplay'
import RecordButton from '@/components/voice/RecordButton'
import PageTransition from '@/components/layout/PageTransition'

export default function BaselineTest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { completeBaseline } = useSession()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState<boolean[]>(BASELINE_SENTENCES.map(() => false))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isRecording, startRecording, stopRecording, resetRecording } = useVoiceRecorder()
  const audioBlobsRef = useRef<Blob[]>([])

  const isAllDone = completed.every(Boolean)

  const handleStopAndNext = () => {
    stopRecording()
    const next = [...completed]
    next[currentIndex] = true
    setCompleted(next)

    setTimeout(() => {
      if (audioBlobsRef.current.length <= currentIndex) {
        // useVoiceRecorder의 audioBlob은 비동기로 생성되므로 약간의 지연 후 수집
      }
      resetRecording()
      if (currentIndex < BASELINE_SENTENCES.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
    }, 100)
  }

  const handleSubmit = async () => {
    if (!id || !user) return
    setIsSubmitting(true)
    setError(null)

    try {
      await voiceApi.submitBaseline(id, new Blob(audioBlobsRef.current, { type: 'audio/webm' }))
      completeBaseline(user.id)
      navigate(`/session/${id}/waiting`)
    } catch {
      setError('전송에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <Header title="기준 발음 측정" showBack />
      <div className="flex-1 px-6 py-6 flex flex-col">
        <div className="text-center mb-10">
          <h2 className="text-[20px] font-bold text-grey-900">
            술 마시기 전 발음을 측정해요
          </h2>
          <p className="text-[14px] text-grey-500 mt-2 leading-relaxed">
            아래 문장을 또박또박 읽어주세요
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-10">
          <SentenceDisplay
            sentence={BASELINE_SENTENCES[currentIndex]}
            currentIndex={currentIndex}
            totalCount={BASELINE_SENTENCES.length}
          />

          <RecordButton
            isRecording={isRecording}
            onStart={startRecording}
            onStop={handleStopAndNext}
          />

          <p className="text-[13px] text-grey-400">
            {isRecording ? '듣고 있어요... 다 읽으면 버튼을 눌러주세요' : '버튼을 눌러 녹음을 시작하세요'}
          </p>
        </div>

        <div className="pb-6 mt-10 flex flex-col gap-2">
          {error && (
            <p className="text-[13px] text-red-500 text-center">{error}</p>
          )}
          <Button
            fullWidth
            size="lg"
            disabled={!isAllDone || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? '전송 중...' : '측정 완료! 대기실로 돌아가기'}
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
