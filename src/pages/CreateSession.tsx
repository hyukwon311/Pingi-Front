/**
 * @file CreateSession.tsx - 방 만들기 페이지
 *
 * 새로운 술자리 방을 생성하는 화면으로, 방장이 다음 정보를 입력한다:
 * - 장소: 술자리 위치 (예: "홍대 포차")
 * - 약속 시간: 모임 시작 시간 (datetime-local input)
 * - 닉네임: 방장의 이름
 * 입력 완료 후 API를 통해 방을 생성하고, 고유 방 코드를 받아 캐릭터 선택 화면으로 이동한다.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import PageTransition from '@/components/layout/PageTransition'
import { useRoom } from '@/contexts/RoomContext'

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function getDefaultTime() {
  const now = new Date()
  now.setHours(19, 30, 0, 0)
  return now.toTimeString().slice(0, 5)
}

export default function CreateSession() {
  const navigate = useNavigate()
  const { joinRoom } = useRoom()
  const [place, setPlace] = useState('')
  const [time, setTime] = useState(getDefaultTime())
  const [nickname, setNickname] = useState('')

  const isValid = place.trim().length > 0 && nickname.trim().length > 0

  const handleCreate = () => {
    if (!isValid) return
    const code = generateCode()
    joinRoom(code, nickname.trim(), true)
    navigate(`/r/${code}/lobby`)
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
        </div>

        <div className="mt-auto pt-6">
          <Button onClick={handleCreate} disabled={!isValid}>
            방 만들기
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
