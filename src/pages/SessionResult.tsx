/**
 * @file SessionResult.tsx - 핑이타임 결과 페이지 (방 전체 동기화)
 */
import { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character from '@/components/common/Character'
import { BREEDS } from '@/components/common/Character'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'
import type { CheckpointResult } from '@/services/api'
import { acknowledgeCheckpointResult } from '@/services/api'
import { useWebSocket } from '@/hooks/useWebSocket'

interface ResultLocationState {
  checkpointResult?: CheckpointResult
}

export default function SessionResult() {
  const { code } = useParams<{ code: string }>()
  const location = useLocation()
  const state = (location.state ?? {}) as ResultLocationState
  const result = state.checkpointResult

  const [confirming, setConfirming] = useState(false)
  const [waitingOthers, setWaitingOthers] = useState(false)
  const [ackedCount, setAckedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(result?.rankings.length ?? 0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useWebSocket({
    roomCode: code || '',
    onResultAckProgress: (payload) => {
      if (!result || payload.checkpointId !== result.checkpointId) return
      setAckedCount(payload.ackedCount)
      setTotalCount(payload.totalCount)
    },
  })

  if (!result || !code) {
    return (
      <PageTransition>
        <div className="flex-1 flex items-center justify-center px-5">
          <p className="text-brown-500 text-center">
            결과를 불러올 수 없어요.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
      </PageTransition>
    )
  }

  const rankings = result.rankings.map((r) => ({
    memberId: r.memberId,
    nickname: r.nickname,
    breed: (r.breed || 'retriever') as CharacterBreed,
    level: r.level,
    levelChange: r.delta,
  }))

  const winner = rankings[0]
  const hungerWarning = result.warnings.find((w) => w.type === 'hunger')

  if (!winner) {
    return (
      <PageTransition>
        <div className="flex-1 flex items-center justify-center px-5">
          <p className="text-brown-500">결과가 아직 없어요</p>
        </div>
      </PageTransition>
    )
  }

  const handleConfirm = async () => {
    setConfirming(true)
    setErrorMessage(null)
    try {
      const ack = await acknowledgeCheckpointResult(result.checkpointId)
      setAckedCount(ack.ackedCount)
      setTotalCount(ack.totalCount)
      if (!ack.allConfirmed) {
        setWaitingOthers(true)
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : '확인에 실패했어요')
    } finally {
      setConfirming(false)
    }
  }

  const ackLabel =
    totalCount > 0 ? `${ackedCount}/${totalCount}명 확인` : '다른 멤버 확인 대기 중...'

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          <h1 className="font-display text-xl text-brown-900">
            🌀 핑이타임 #{result.index} 결과
          </h1>
        </div>

        <Card highlight className="mt-6 text-center relative overflow-visible">
          <span className="absolute -top-2 -right-2 text-2xl">🔥</span>
          <p className="text-xs text-brown-500 mb-3">🏆 가장 많이 취한 사람</p>
          <Character
            breed={winner.breed}
            level={winner.level as 0|1|2|3|4|5}
            size="lg"
            showEffects
          />
          <p className="font-display text-lg text-brown-900 mt-3">
            {winner.nickname} ({BREEDS[winner.breed as keyof typeof BREEDS]?.name || winner.breed})
          </p>
          <p className="text-sm text-ink font-bold mt-1">
            Level {winner.level}
            {winner.levelChange > 0 && ` · ▲ +${winner.levelChange} 단계`}
            {winner.levelChange === 0 && ' · (=)'}
          </p>
        </Card>

        <div className="divider" />
        <div>
          <p className="text-sm font-bold text-brown-900 mb-3">전체 순위</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-card">
            {rankings.map((r, idx) => (
              <div
                key={r.memberId}
                className={`flex items-center px-4 py-3 ${
                  idx !== rankings.length - 1 ? 'border-b border-brown-100' : ''
                }`}
              >
                <span className={`w-8 font-display text-sm ${idx < 2 ? 'text-ink' : 'text-brown-400'}`}>
                  {idx + 1}위
                </span>
                <div className="w-10 flex justify-center">
                  <Character
                    breed={r.breed}
                    level={r.level as 0|1|2|3|4|5}
                    size="xs"
                    showEffects={false}
                  />
                </div>
                <span className="flex-1 ml-2 font-display text-sm text-brown-900">
                  {r.nickname}
                </span>
                <span className="font-display text-sm text-brown-700 mr-2">
                  L{r.level}
                </span>
                <span className={`text-sm font-bold ${
                  r.levelChange > 0 ? 'text-ink' : 'text-brown-400'
                }`}>
                  {r.levelChange > 0 ? `(+${r.levelChange})` : '(=)'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {hungerWarning && (
          <div className="mt-4 px-4 py-3 bg-highlight/20 rounded-xl">
            <p className="text-sm text-brown-700 text-center">{hungerWarning.message}</p>
          </div>
        )}

        <div className="mt-auto pt-6">
          {waitingOthers && (
            <p className="text-sm text-brown-500 text-center mb-3">{ackLabel}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-600 text-center mb-3">{errorMessage}</p>
          )}
          <Button onClick={handleConfirm} disabled={confirming || waitingOthers}>
            {confirming ? '확인 중...' : waitingOthers ? '다른 멤버 확인 대기...' : '확인'}
          </Button>
        </div>


        
      </div>
    </PageTransition>
  )
}
