/**
 * @file SessionDashboard.tsx - 술자리 메인 화면
 *
 * 술자리가 진행되는 동안 계속 보이는 메인 대시보드 화면이다.
 * 상단에는 다음 핑이타임까지 남은 시간이 카운트다운 타이머로 표시되고,
 * 사용자는 "내 잔수" 섹션에서 술 종류별(소주, 맥주, 소맥, 와인, 양주) 버튼을 눌러 음주량을 기록한다.
 * 중간 섹션에는 모든 멤버의 캐릭터와 현재 취도 레벨(LV0~5)이 그리드로 표시되며,
 * 레벨이 높을수록 캐릭터가 취한 모습으로 변화한다.
 * "지금 바로 핑이타임!" 버튼으로 즉시 발음 측정을 시작할 수 있고,
 * 방장에게는 "술자리 종료" 버튼이 추가로 표시된다.
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRoom } from '@/contexts/RoomContext'
import { useTimer } from '@/hooks/useTimer'
import { TEST_INTERVAL_MS } from '@/constants/levels'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character from '@/components/common/Character'
import { sojuMultiplier } from '@/components/common/DrinkChip'
import PageTransition from '@/components/layout/PageTransition'
import type { DrinkType, CharacterBreed } from '@/types/room'

const DRINK_BUTTONS: { type: DrinkType; emoji: string; label: string }[] = [
  { type: 'soju', emoji: '🍶', label: '소주 1잔' },
  { type: 'beer', emoji: '🍺', label: '맥주 1잔' },
  { type: 'somaek', emoji: '🍻', label: '소맥 1잔' },
  { type: 'wine', emoji: '🍷', label: '와인 1잔' },
  { type: 'liquor', emoji: '🥃', label: '양주 1잔' },
]

interface MemberStatus {
  memberId: string
  nickname: string
  breed: CharacterBreed
  level: number
}

export default function SessionDashboard() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { currentMember } = useRoom()

  const [drinkCounts, setDrinkCounts] = useState<Record<DrinkType, number>>({
    soju: 0, beer: 0, somaek: 0, wine: 0, liquor: 0,
  })

  const { remaining } = useTimer({
    durationMs: TEST_INTERVAL_MS,
    autoStart: true,
    onComplete: () => navigate(`/r/${code}/record`),
  })

  // TODO: API/WebSocket에서 실시간 멤버 상태 받기
  const members: MemberStatus[] = [
    { memberId: '1', nickname: '민준', breed: 'retriever', level: 0 },
    { memberId: '2', nickname: '수진', breed: 'pomeranian', level: 0 },
    { memberId: '3', nickname: '지훈', breed: 'shiba', level: 2 },
    { memberId: '4', nickname: currentMember?.nickname ?? '나', breed: 'poodle', level: 0 },
  ]

  const isHost = currentMember?.isHost ?? true

  const totalDrinks = Object.values(drinkCounts).reduce((sum, count) => sum + count, 0)
  const totalSoju = DRINK_BUTTONS.reduce(
    (sum, { type }) => sum + drinkCounts[type] * sojuMultiplier[type],
    0
  )

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`
  }

  const handleAddDrink = (type: DrinkType) => {
    setDrinkCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))
    // TODO: API로 음주 로그 저장
  }

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="text-center">
          <h1 className="font-display text-2xl text-brown-900">🌀 핑이 LIVE</h1>
        </div>

        <Card className="mt-5 text-center">
          <p className="text-xs text-brown-500">다음 핑이타임까지</p>
          <p className="font-display text-3xl text-ink mt-1">
            {formatTime(remaining)}
          </p>
        </Card>

        <div className="divider" />

        <div>
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-sm font-bold text-brown-900">내 잔수</p>
            <p className="text-xs text-brown-400">
              = 소주 {totalSoju.toFixed(1)}잔 기준
            </p>
          </div>
          
          <Card className="text-center mb-4">
            <p className="font-display text-4xl text-ink">{totalDrinks}잔</p>
          </Card>

          <p className="text-xs text-brown-500 mb-2">술 마실 때마다 눌러주세요</p>
          <div className="grid grid-cols-3 gap-2">
            {DRINK_BUTTONS.map(({ type, emoji, label }) => (
              <button
                key={type}
                onClick={() => handleAddDrink(type)}
                className="flex flex-col items-center gap-1 py-3 px-2 bg-white border-2 border-brown-300 rounded-xl active:scale-95 active:bg-highlight/20 transition-all"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-bold text-brown-900">{label}</span>
                {drinkCounts[type] > 0 && (
                  <span className="text-[10px] text-brown-400">({drinkCounts[type]}잔)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div>
          <p className="text-sm font-bold text-brown-900 mb-3">현재 멤버 상태</p>
          <div className="grid grid-cols-4 gap-2">
            {members.map((m) => (
              <div key={m.memberId} className="text-center">
                <Character breed={m.breed} level={m.level} size="sm" />
                <p className="font-display text-xs mt-1 text-brown-900">{m.nickname}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={() => navigate(`/r/${code}/record`)}
          >
            🌀 지금 바로 핑이타임!
          </Button>

          {isHost && (
            <Button
              variant="secondary"
              onClick={() => navigate(`/r/${code}/awards`)}
            >
              술자리 종료
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
