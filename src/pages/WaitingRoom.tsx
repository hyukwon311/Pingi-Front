/**
 * @file WaitingRoom.tsx - 대기 화면
 *
 * 모든 멤버가 장소에 도착할 때까지 대기하는 화면이다.
 * 참여 중인 멤버들의 캐릭터, 닉네임, ETA 상태를 그리드로 표시하며,
 * 각 멤버는 자신의 도착 예정 시간을 변경하거나 "도착했어요!" 버튼을 눌러 도착을 알릴 수 있다.
 * 화면 하단에는 친구 초대용 링크 공유 버튼이 있으며,
 * 방장에게만 "다 모였어! (시작)" 버튼이 표시되어 술자리를 시작할 수 있다.
 * 시작 시 모든 멤버가 캐릭터 확인 화면으로 이동한다.
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRoom } from '@/contexts/RoomContext'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character from '@/components/common/Character'
import EtaPreset, { type EtaPresetType } from '@/components/common/EtaPreset'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'

interface WaitingMember {
  memberId: string
  nickname: string
  characterBreed: CharacterBreed
  etaStatus: 'arrived' | 'ontime' | '5min' | '10min' | 'late'
}

export default function WaitingRoom() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { currentMember } = useRoom()
  const [myEta, setMyEta] = useState<EtaPresetType>('ontime')
  const [hasArrived, setHasArrived] = useState(false)
  const [copied, setCopied] = useState(false)

  // TODO: API/WebSocket에서 실시간 멤버 목록 받기
  const members: WaitingMember[] = [
    { memberId: '1', nickname: '민준', characterBreed: 'retriever', etaStatus: 'arrived' },
    { memberId: '2', nickname: '수진', characterBreed: 'pomeranian', etaStatus: 'arrived' },
    { memberId: '3', nickname: '지훈', characterBreed: 'shiba', etaStatus: '10min' },
    { memberId: '4', nickname: currentMember?.nickname ?? '나', characterBreed: 'poodle', etaStatus: hasArrived ? 'arrived' : myEta === 'ontime' ? 'ontime' : myEta === 'late5' ? '5min' : myEta === 'late10' ? '10min' : 'late' },
  ]

  const roomInfo = {
    place: '강남역 4번출구',
    scheduledAt: '19:30',
  }

  // TODO: 실제로는 currentMember?.isHost 사용
  const isHost = currentMember?.isHost ?? true // 테스트용 기본값 true
  const shareUrl = `pingi.app/r/${code}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleArrived = () => {
    setHasArrived(true)
    // TODO: API 호출하여 도착 상태 업데이트
  }

  const handleStart = () => {
    navigate(`/r/${code}/confirm`)
  }

  const getEtaLabel = (status: WaitingMember['etaStatus']) => {
    switch (status) {
      case 'arrived': return '✓ 도착'
      case 'ontime': return '✓ 정시'
      case '5min': return '⏰ 5분'
      case '10min': return '⏰ 10분'
      case 'late': return '🔴 많이'
    }
  }

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          <h1 className="font-display text-2xl text-brown-900">🌀 모이는 중</h1>
          <p className="text-sm text-brown-500 mt-2">
            📍 {roomInfo.place} · ⏰ {roomInfo.scheduledAt}
          </p>
        </div>

        <Card className="mt-6">
          <div className="grid grid-cols-4 gap-2">
            {members.map((m) => (
              <div key={m.memberId} className="text-center">
                <Character breed={m.characterBreed} level={0} size="sm" showBadge={false} showEffects={false} />
                <p className="font-display text-xs mt-1 text-brown-900">{m.nickname}</p>
                <p className={`text-[10px] ${m.etaStatus === 'arrived' ? 'text-success' : m.etaStatus === 'ontime' ? 'text-brown-500' : 'text-warning'}`}>
                  {getEtaLabel(m.etaStatus)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {!hasArrived && (
          <div className="mt-5">
            <p className="text-xs text-brown-500 mb-2">도착 예정 시간</p>
            <EtaPreset selected={myEta} onSelect={setMyEta} />
          </div>
        )}

        <Card className="mt-5">
          <p className="text-[10px] text-brown-500 mb-1">링크 공유:</p>
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm text-brown-900 font-medium truncate">
              {shareUrl}
            </span>
            <button
              onClick={handleCopy}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-highlight/20 text-xs font-bold text-brown-900"
            >
              {copied ? '복사됨!' : '📋 복사'}
            </button>
          </div>
        </Card>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          {!hasArrived ? (
            <Button variant="success" onClick={handleArrived}>
              📍 도착했어요!
            </Button>
          ) : (
            <div className="text-center py-3 bg-success/10 rounded-xl">
              <p className="font-display text-success">✓ 도착 완료!</p>
            </div>
          )}

          {isHost && (
            <Button onClick={handleStart}>
              다 모였어! (시작)
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
