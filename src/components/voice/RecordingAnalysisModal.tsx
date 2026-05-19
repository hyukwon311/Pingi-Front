/**
 * @file RecordingAnalysisModal.tsx - 핑이타임 개인 분석 결과
 */
import type { ReactNode } from 'react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import LevelBadge, { levelLabels } from '@/components/common/LevelBadge'

export type AnalysisStatus = 'normal' | 'fake_acting' | 'drunk'

export interface RecordingAnalysisModalProps {
  open: boolean
  onClose: () => void
  level: number
  levelDescription: string
  isFakeActing: boolean
  status?: AnalysisStatus
  delta?: number
}

export default function RecordingAnalysisModal({
  open,
  onClose,
  level,
  levelDescription,
  isFakeActing,
  status = 'normal',
  delta = 0,
}: RecordingAnalysisModalProps) {
  const isFake = isFakeActing || status === 'fake_acting'
  const safeLevel = Math.min(Math.max(level, 0), 5) as 0 | 1 | 2 | 3 | 4 | 5

  return (
    <Modal open={open} onClose={onClose}>
      <ResultPanel isFake={isFake}>
        {isFake ? (
          <>
            <p className="text-5xl mb-3" aria-hidden>
              🎭
            </p>
            <h2 className="font-display text-lg text-brown-900 leading-snug">
              {levelDescription || '취한 척 하신 거 같은데… 흠 ~'}
            </h2>
            <p className="text-sm text-brown-500 mt-3">
              연기는 인정! 진짜 취함 측정은 패스할게요
            </p>
          </>
        ) : (
          <>
            <p className="text-4xl mb-3" aria-hidden>
              {level >= 4 ? '🥴' : level >= 2 ? '😵‍💫' : '😊'}
            </p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <LevelBadge level={safeLevel} />
              <span className="font-display text-base text-brown-900">
                Lv.{level} {levelLabels[safeLevel] ?? ''}
              </span>
            </div>
            <h2 className="font-display text-lg text-brown-900">
              {levelDescription || levelLabels[safeLevel] || '분석 완료'}
            </h2>
            {delta !== 0 && (
              <p className="text-sm text-brown-500 mt-2">
                {delta > 0
                  ? `▲ ${delta}단계 올랐어요`
                  : `▼ ${Math.abs(delta)}단계`}
              </p>
            )}
          </>
        )}

        <div className="mt-5">
          <Button onClick={onClose}>확인</Button>
        </div>
      </ResultPanel>
    </Modal>
  )
}

function ResultPanel({
  isFake,
  children,
}: {
  isFake: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`py-2 ${isFake ? 'bg-highlight/15 -mx-2 px-2 rounded-2xl' : ''}`}
    >
      {children}
    </div>
  )
}
