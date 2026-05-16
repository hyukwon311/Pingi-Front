/**
 * @file PingiTimeResult.tsx - 핑이타임 결과 모달
 *
 * 핑이타임 녹음 후 결과를 보여주는 모달.
 * 1위 카드 + 전체 순위 + 레벨 변화.
 */
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import LevelBadge, { levelLabels } from '@/components/common/LevelBadge'
import Tag from '@/components/common/Tag'

interface ResultMember {
  memberId: string
  nickname: string
  level: number
  levelChange: number
}

interface PingiTimeResultProps {
  open: boolean
  pingiTimeNumber: number
  results: ResultMember[]
  onClose: () => void
}

export default function PingiTimeResult({
  open,
  pingiTimeNumber,
  results,
  onClose,
}: PingiTimeResultProps) {
  const winner = results[0]

  const getLevelChangeText = (change: number) => {
    if (change > 0) return `+${change}`
    if (change < 0) return `${change}`
    return '='
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="py-2">
        <h2 className="font-display text-lg text-brown-900">
          🌀 핑이타임 #{pingiTimeNumber} 결과
        </h2>

        {winner && (
          <div className="mt-4 p-3 bg-highlight/20 rounded-xl">
            <Tag className="mb-2">🏆 가장 많이 취한 사람</Tag>
            <div className="w-14 h-16 mx-auto bg-highlight/30 rounded-xl flex items-center justify-center text-3xl animate-wobble-mid">
              🐶
            </div>
            <p className="font-display text-base text-brown-900 mt-2">
              {winner.nickname}
            </p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <LevelBadge level={winner.level} />
              <span className="text-xs text-brown-500">
                {levelLabels[winner.level]}
              </span>
            </div>
            <p className="text-sm text-ink font-bold mt-1">
              ▲ {getLevelChangeText(winner.levelChange)} 단계
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-1.5 max-h-40 overflow-y-auto">
          {results.map((r, idx) => (
            <div
              key={r.memberId}
              className="flex items-center justify-between px-3 py-2 bg-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-brown-400 w-5">{idx + 1}위</span>
                <span className="text-sm text-brown-900">{r.nickname}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LevelBadge level={r.level} size="sm" />
                <span className={`text-[10px] ${r.levelChange > 0 ? 'text-ink' : 'text-brown-400'}`}>
                  ({getLevelChangeText(r.levelChange)})
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </Modal>
  )
}
