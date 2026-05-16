/**
 * @file BaselineTest.tsx - 기준 발음 측정 페이지
 *
 * 술 마시기 전의 기준 발음을 측정하는 화면.
 * 사용자는 3개의 잰말 문장을 순서대로 녹음하며,
 * 모든 문장 녹음이 완료되면 "측정 완료" 버튼이 활성화되어 세션으로 이동할 수 있다.
 *
 * 플로우: 문장 표시 → 녹음 버튼 클릭 → 녹음 → 정지 → 다음 문장 → ... → 완료
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BASELINE_SENTENCES } from '@/constants/sentences'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import SentenceDisplay from '@/components/voice/SentenceDisplay'
import RecordButton from '@/components/voice/RecordButton'
import PageTransition from '@/components/layout/PageTransition'
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder'

export default function BaselineTest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completed, setCompleted] = useState<boolean[]>(BASELINE_SENTENCES.map(() => false))
  const { isRecording, startRecording, stopRecording, resetRecording } = useVoiceRecorder()

  const isAllDone = completed.every(Boolean)

  /** 녹음 정지 후 현재 문장을 완료 처리하고 다음 문장으로 이동 */
  const handleStopAndNext = () => {
    stopRecording()
    const next = [...completed]
    next[currentIndex] = true
    setCompleted(next)
    resetRecording()

    if (currentIndex < BASELINE_SENTENCES.length - 1) {
      setCurrentIndex(currentIndex + 1)
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

        <div className="pb-6 mt-10">
          <Button
            fullWidth
            size="lg"
            disabled={!isAllDone}
            onClick={() => navigate(`/session/${id}`)}
          >
            측정 완료! 술자리 시작
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
