/**
 * @file JoinSession.tsx - 방 입장 페이지
 *
 * 초대 링크(/r/:code)를 통해 방에 처음 입장할 때 표시되는 화면이다.
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Card from '@/components/common/Card'
import PageTransition from '@/components/layout/PageTransition'
import { useRoom } from '@/contexts/RoomContext'
import { getRoom, joinRoom as apiJoinRoom, setCurrentMemberId } from '@/services/api'

export default function JoinSession() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { joinRoom, setRoom, setMemberId } = useRoom()
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const [roomInfo, setRoomInfo] = useState({
    hostNickname: '',
    place: '',
    scheduledAt: '',
    memberCount: 0,
  })

  useEffect(() => {
    async function fetchRoomInfo() {
      if (!code) return
      try {
        const room = await getRoom(code)
        const host = room.members.find(m => m.isHost)
        setRoomInfo({
          hostNickname: host?.nickname || '방장',
          place: room.location,
          scheduledAt: new Date(room.scheduledAt).toLocaleString('ko-KR', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          memberCount: room.members.length,
        })
        setRoom(room)
      } catch (err) {
        setError('방을 찾을 수 없어요')
      } finally {
        setLoading(false)
      }
    }
    fetchRoomInfo()
  }, [code, setRoom])

  const handleJoin = async () => {
    if (!nickname.trim() || !code) return
    
    setJoining(true)
    setError('')
    
    try {
      const response = await apiJoinRoom(code, { nickname: nickname.trim() })
      
      // Context에 저장
      joinRoom(code, nickname.trim(), false)
      setMemberId(response.member.id)
      setCurrentMemberId(response.member.id)
      setRoom(response.room)
      
      navigate(`/r/${code}/character`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '입장에 실패했어요')
    } finally {
      setJoining(false)
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

  if (error && !roomInfo.place) {
    return (
      <PageTransition>
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <p className="text-xl mb-4">😢</p>
          <p className="text-brown-900 font-bold">{error}</p>
          <Button className="mt-6" onClick={() => navigate('/')}>
            홈으로
          </Button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="flex-1 px-5 py-10 flex flex-col">
        <div className="text-center">
          <div className="text-5xl mb-4">🌀</div>
          <h1 className="font-display text-2xl text-brown-900">핑이</h1>
        </div>

        <Card className="mt-8 text-center">
          <p className="text-sm text-brown-500">
            <span className="font-bold text-brown-900">{roomInfo.hostNickname}</span>
            님이 초대했어요
          </p>
          <div className="divider" />
          <div className="flex flex-col gap-1 text-sm text-brown-900">
            <p>📍 {roomInfo.place}</p>
            <p>⏰ {roomInfo.scheduledAt}</p>
          </div>
          <p className="text-xs text-brown-400 mt-3">
            현재 참여중: {roomInfo.memberCount}명
          </p>
        </Card>

        <div className="mt-6">
          <Input
            label="닉네임"
            placeholder="이 술자리에서 부를 이름"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={10}
          />
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>

        <div className="mt-auto pt-6">
          <Button onClick={handleJoin} disabled={nickname.trim().length < 1 || joining}>
            {joining ? '입장 중...' : '입장하기'}
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
