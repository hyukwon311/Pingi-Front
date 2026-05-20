/**
 * @file WaitingRoom.tsx - 대기 화면
 *
 * 모든 멤버가 장소에 도착할 때까지 대기하는 화면이다.
 */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRoom } from '@/contexts/RoomContext'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Character from '@/components/common/Character'
import EtaPreset, { type EtaPresetType } from '@/components/common/EtaPreset'
import PageTransition from '@/components/layout/PageTransition'
import type { CharacterBreed } from '@/types/room'
import { getRoom, updateMember, getCurrentMemberId, startRoom as apiStartRoom } from '@/services/api'
import { useWebSocket } from '@/hooks/useWebSocket'

interface WaitingMember {
  memberId: string
  nickname: string
  characterBreed: CharacterBreed
  etaStatus: 'arrived' | 'ontime' | '5min' | '10min' | 'late'
  isHost?: boolean
}

export default function WaitingRoom() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { currentMember, setRoom } = useRoom()
  const [myEta, setMyEta] = useState<EtaPresetType>('ontime')
  const [hasArrived, setHasArrived] = useState(false)
  const [copied, setCopied] = useState(false)
  const [members, setMembers] = useState<WaitingMember[]>([])
  const [roomInfo, setRoomInfo] = useState({ place: '', scheduledAt: '' })
  const [isHost, setIsHost] = useState(false)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  // WebSocket 연결 - room_started 이벤트 시 자동으로 /live로 이동
  useWebSocket({
    roomCode: code || '',
    onMemberJoined: () => fetchRoom(),
    onMemberUpdated: () => fetchRoom(),
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
        characterBreed: (m.breed || 'retriever') as CharacterBreed,
        etaStatus: m.arrived ? 'arrived' :
          m.etaPreset === 'late5' ? '5min' :
            m.etaPreset === 'late10' ? '10min' :
              m.etaPreset === 'late20' ? 'late' : 'ontime',
        isHost: m.isHost,
      })))

      setRoomInfo({
        place: room.location,
        scheduledAt: new Date(room.scheduledAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      })

      const me = room.members.find(m => m.id === currentId)
      console.log('[WaitingRoom] currentId:', currentId)
      console.log('[WaitingRoom] members:', room.members.map(m => ({ id: m.id, isHost: m.isHost })))
      console.log('[WaitingRoom] me:', me)

      if (me) {
        setIsHost(me.isHost)
        setHasArrived(me.arrived)
      } else {
        // currentId가 없거나 매칭 안되면 localStorage 초기화하고 다시 입장 필요
        console.warn('[WaitingRoom] Member not found, currentId:', currentId)
      }
    } catch (error) {
      console.error('Failed to fetch room:', error)
    } finally {
      setLoading(false)
    }
  }, [code, setRoom])

  useEffect(() => {
    fetchRoom()

    // 5초마다 방 정보 새로고침
    const interval = setInterval(fetchRoom, 5000)
    return () => clearInterval(interval)
  }, [fetchRoom])

  const shareUrl = `${code}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`https://${shareUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleArrived = async () => {
    const memberId = getCurrentMemberId()
    if (!memberId) return

    try {
      await updateMember(memberId, { arrived: true })
      setHasArrived(true)
      fetchRoom()
    } catch (error) {
      console.error('Failed to update arrival:', error)
    }
  }

  const handleEtaChange = async (eta: EtaPresetType) => {
    setMyEta(eta)
    const memberId = getCurrentMemberId()
    if (!memberId) return

    try {
      await updateMember(memberId, { etaPreset: eta })
      fetchRoom()
    } catch (error) {
      console.error('Failed to update ETA:', error)
    }
  }

  const handleStart = async () => {
    if (!code || !isHost) return
    setStarting(true)
    try {
      await apiStartRoom(code)
      // WebSocket이 room_started 이벤트를 받으면 자동 이동됨
      // 하지만 방장은 바로 이동
      navigate(`/r/${code}/confirm`)
    } catch (error) {
      console.error('Failed to start room:', error)
    } finally {
      setStarting(false)
    }
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
          <h1 className="font-display text-2xl text-brown-900">🌀 모이는 중</h1>
          <p className="text-sm text-brown-500 mt-2">
            📍 {roomInfo.place} · ⏰ {roomInfo.scheduledAt}
          </p>
        </div>

        <Card className="mt-6">
          {members.length === 0 ? (
            <p className="text-center text-brown-500 py-4">아직 참여자가 없어요</p>
          ) : (
            <div className={`grid gap-2 ${members.length <= 4 ? 'grid-cols-' + Math.min(members.length, 4) : 'grid-cols-4'}`}>
              {members.map((m) => (
                <div key={m.memberId} className="text-center">
                  <Character breed={m.characterBreed} level={0} size="sm" showBadge={false} showEffects={false} />
                  <p className="font-display text-xs mt-1 text-brown-900">
                    {m.nickname}
                    {m.isHost && ' 👑'}
                  </p>
                  <p className={`text-[10px] ${m.etaStatus === 'arrived' ? 'text-success' : m.etaStatus === 'ontime' ? 'text-brown-500' : 'text-warning'}`}>
                    {getEtaLabel(m.etaStatus)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {!hasArrived && (
          <div className="mt-5">
            <p className="text-xs text-brown-500 mb-2">도착 예정 시간</p>
            <EtaPreset selected={myEta} onSelect={handleEtaChange} />
          </div>
        )}

        <Card className="mt-5">
          <p className="text-[10px] text-brown-500 mb-1">초대 코드:</p>
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
            <Button onClick={handleStart} disabled={starting}>
              {starting ? '시작 중...' : '다 모였어! (시작)'}
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
