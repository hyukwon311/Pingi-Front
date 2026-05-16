/**
 * @file CreateSession.tsx - 방 만들기 페이지
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import PageTransition from '@/components/layout/PageTransition'
import { useRoom } from '@/contexts/RoomContext'
import { createRoom, setCurrentMemberId } from '@/services/api'

function getDefaultDateTime() {
  const now = new Date()
  now.setHours(19, 30, 0, 0)
  return now
}

function getDefaultTime() {
  return getDefaultDateTime().toTimeString().slice(0, 5)
}

export default function CreateSession() {
  const navigate = useNavigate()
  const { joinRoom, setRoom, setMemberId } = useRoom()
  const [place, setPlace] = useState('')
  const [time, setTime] = useState(getDefaultTime())
  const [nickname, setNickname] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const isValid = place.trim().length > 0 && nickname.trim().length > 0

  const handleCreate = async () => {
    if (!isValid) return
    
    setCreating(true)
    setError('')
    
    try {
      // 시간을 오늘 날짜와 결합
      const [hours, minutes] = time.split(':').map(Number)
      const scheduledAt = new Date()
      scheduledAt.setHours(hours ?? 19, minutes ?? 30, 0, 0)
      
      const response = await createRoom({
        hostNickname: nickname.trim(),
        location: place.trim(),
        scheduledAt: scheduledAt.toISOString(),
      })
      
      // Context에 저장
      joinRoom(response.room.code, nickname.trim(), true)
      setMemberId(response.host.id)
      setCurrentMemberId(response.host.id)
      setRoom(response.room)
      
      // 캐릭터 선택 화면으로 이동
      navigate(`/r/${response.room.code}/character`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '방 생성에 실패했어요')
    } finally {
      setCreating(false)
    }
  }

  return (
    <PageTransition>
      <Header title="방 만들기" showBack />
      <div className="flex-1 px-5 py-6 flex flex-col">
        <div className="flex flex-col gap-5">
          <Input
            label="장소"
            placeholder="예: 강남역 4번출구"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            maxLength={30}
          />

          <div>
            <label className="block text-xs font-semibold text-brown-500 mb-1">
              약속 시간
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border-[1.5px] border-brown-300 rounded-[10px] text-sm text-brown-900 focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          <Input
            label="방장 닉네임"
            placeholder="이 술자리에서 부를 이름"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={10}
          />
          
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        <div className="mt-auto pt-6">
          <Button onClick={handleCreate} disabled={!isValid || creating}>
            {creating ? '생성 중...' : '방 만들기'}
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
