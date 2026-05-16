/**
 * @file JoinSession.tsx - 방 입장 페이지
 *
 * 초대 링크(/r/:code)를 통해 방에 처음 입장할 때 표시되는 화면이다.
 * 상단에 방 정보(장소, 시간, 방장 이름)를 카드로 표시하고,
 * 참여자가 자신의 닉네임을 입력하여 방에 참가할 수 있게 한다.
 * 닉네임 입력 후 RoomContext에 멤버 정보를 저장하고 캐릭터 선택 화면으로 이동한다.
 */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Card from '@/components/common/Card'
import PageTransition from '@/components/layout/PageTransition'
import { useRoom } from '@/contexts/RoomContext'

export default function JoinSession() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { joinRoom } = useRoom()
  const [nickname, setNickname] = useState('')

  // TODO: API에서 방 정보 불러오기
  const roomInfo = {
    hostNickname: '민준',
    place: '강남역 4번출구',
    scheduledAt: '오늘 19:30',
    memberCount: 2,
  }

  const handleJoin = () => {
    if (!nickname.trim() || !code) return
    joinRoom(code, nickname.trim())
    navigate(`/r/${code}/character`)
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
        </div>

        <div className="mt-auto pt-6">
          <Button onClick={handleJoin} disabled={nickname.trim().length < 1}>
            입장하기
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
