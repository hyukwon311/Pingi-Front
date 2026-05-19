/**
 * @file SessionDashboard.tsx - 술자리 메인 화면
 */
import { useState, useEffect, useCallback } from 'react'
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
import { getRoom, addDrink, getCurrentMemberId, triggerPingiTime } from '@/services/api'
import { useWebSocket } from '@/hooks/useWebSocket'

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
  isHost: boolean
}

export default function SessionDashboard() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { currentMember, setRoom } = useRoom()

  const [drinkCounts, setDrinkCounts] = useState<Record<DrinkType, number>>({
    soju: 0, beer: 0, somaek: 0, wine: 0, liquor: 0,
  })
  const [members, setMembers] = useState<MemberStatus[]>([])
  const [isHost, setIsHost] = useState(false)
  const [loading, setLoading] = useState(true)
  const [triggering, setTriggering] = useState(false)
  const [triggerError, setTriggerError] = useState<string | null>(null)
  const [nextPingiEndsAt, setNextPingiEndsAt] = useState<number | null>(() => {
    if (!code) return null
    const raw = sessionStorage.getItem(`pingi_next_ends_${code}`)
    if (!raw) return null
    const t = Date.parse(raw)
    return t > Date.now() ? t : null
  })

  useWebSocket({
    roomCode: code || '',
    onMemberUpdated: () => fetchRoom(),
    onPingiLiveResumed: (payload) => {
      const endsAt = Date.parse(payload.nextPingiEndsAt)
      if (code) {
        sessionStorage.setItem(`pingi_next_ends_${code}`, payload.nextPingiEndsAt)
      }
      setNextPingiEndsAt(endsAt)
    },
  })

  const { remaining } = useTimer({
    durationMs: TEST_INTERVAL_MS,
    autoStart: true,
    endsAtMs: nextPingiEndsAt,
    onComplete: async () => {
      // 타이머 종료 시 방장만 핑이타임 트리거
      if (isHost && code) {
        try {
          await triggerPingiTime(code)
        } catch (error) {
          console.error('Failed to trigger pingi time:', error)
        }
      }
    },
  })

  const fetchRoom = useCallback(async () => {
    if (!code) return
    try {
      const room = await getRoom(code)
      setRoom(room)
      
      const currentId = getCurrentMemberId()
      
      setMembers(room.members.map(m => ({
        memberId: m.id,
        nickname: m.nickname,
        breed: (m.breed || 'retriever') as CharacterBreed,
        level: m.level ?? 0,
        isHost: m.isHost,
      })))
      
      const me = room.members.find(m => m.id === currentId)
      if (me) {
        setIsHost(me.isHost)
        if (me.drinks) {
          setDrinkCounts({
            soju: me.drinks.soju ?? 0,
            beer: me.drinks.beer ?? 0,
            somaek: me.drinks.somaek ?? 0,
            wine: me.drinks.wine ?? 0,
            liquor: me.drinks.liquor ?? 0,
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch room:', error)
    } finally {
      setLoading(false)
    }
  }, [code, setRoom])

  useEffect(() => {
    fetchRoom()
    
    // 10초마다 방 정보 새로고침
    const interval = setInterval(fetchRoom, 10000)
    return () => clearInterval(interval)
  }, [fetchRoom])

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

  const handleAddDrink = async (type: DrinkType) => {
    const memberId = getCurrentMemberId()
    if (!memberId) return
    
    // 먼저 UI 업데이트
    setDrinkCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))
    
    try {
      await addDrink(memberId, type, 1)
    } catch (error) {
      console.error('Failed to add drink:', error)
      // 실패하면 롤백
      setDrinkCounts((prev) => ({
        ...prev,
        [type]: prev[type] - 1,
      }))
    }
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-brown-500">로딩 중...</p>
        </div>
      </PageTransition>
    )
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
          {members.length === 0 ? (
            <p className="text-center text-brown-500 py-4">멤버가 없어요</p>
          ) : (
            <div className={`grid gap-2 ${members.length <= 4 ? 'grid-cols-' + Math.min(members.length, 4) : 'grid-cols-4'}`}>
              {members.map((m) => (
                <div key={m.memberId} className="text-center">
                  <Character breed={m.breed} level={m.level} size="sm" />
                  <p className="font-display text-xs mt-1 text-brown-900">
                    {m.nickname}
                    {m.isHost && ' 👑'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          <Button
            variant="primary"
            disabled={triggering}
            onClick={async () => {
              if (!code) return
              setTriggering(true)
              setTriggerError(null)
              try {
                await triggerPingiTime(code)
              } catch (error) {
                const msg = error instanceof Error ? error.message : '핑이타임 시작에 실패했어요'
                setTriggerError(msg)
              } finally {
                setTriggering(false)
              }
            }}
          >
            {triggering ? '시작 중...' : '🌀 지금 바로 핑이타임!'}
          </Button>

          {triggerError && (
            <p className="text-sm text-red-600 text-center">{triggerError}</p>
          )}

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
